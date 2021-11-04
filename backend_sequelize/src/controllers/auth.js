const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    findAccountByIdentifier,
    lockAccount
} = require('../models/accounts');

const { updatePasswordAttempts } = require('../models/passwords.js');

const { ACCOUNT_STATUS } = require('../config/enums');

const r = require('../utils/response').responses;
const E = require('../errors/Errors');

const {
    jwt: { secret: jwtSecret },
    cookie: { secret: cookieSecret }
} = require('../config/config');

// CLIENT LOGIN
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const account = await findAccountByIdentifier(username, true);

        // no account matching username
        if (!account) throw new E.AccountNotFoundError();

        // because of the one-to-many r/s btw account and passwords,
        // passwords is an array even though theres only one active password
        const {
            password_id,
            password: hash,
            attempts: passwordAttempts
        } = account.passwords[0];

        // if the account is locked or
        // the password has been attempted for more than 5 times
        if (account.status === ACCOUNT_STATUS.LOCKED || passwordAttempts > 5)
            throw new E.AccountStatusError(ACCOUNT_STATUS.LOCKED);

        if (account.status === ACCOUNT_STATUS.DEACTIVATED)
            throw new E.AccountStatusError(ACCOUNT_STATUS.DEACTIVATED);

        // Check if password is correct
        const valid = bcrypt.compareSync(password, hash);

        // If password is not valid
        if (!valid) {
            const attempts = passwordAttempts + 1;
            await updatePasswordAttempts(password_id, attempts);

            // lock the account
            if (attempts >= 5) {
                await lockAccount(account.account_id);
                throw new E.AccountStatusError(ACCOUNT_STATUS.LOCKED);
            }

            // incorrect password but less than 5 password attempts
            throw new E.WrongPasswordError();
        }

        // If password is valid

        // reset password attempts
        // avoid unnecessary writing to database
        if (passwordAttempts > 0) await updatePasswordAttempts(password_id, 0);

        // generate tokens
        const accessToken = jwt.sign(
            {
                account_id: account.account_id,
                username: account.username,
                email: account.email,
                admin_level: account.admin_level
            },
            jwtSecret,
            { expiresIn: '6h' }
        );

        const refreshToken = jwt.sign(
            { account_id: account.account_id },
            cookieSecret,
            { expiresIn: '3d' }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            maxAge: 259200000,
            sameSite: 'none'
        });

        res.status(200).json(r.success200({
            access_token: accessToken,
            username: account.username,
            email: account.email
        }));

        return next();
    }
    catch (error) {
        return next(error);
    }
};

// ============================================================

module.exports.refreshToken = async (req, res, next) => {
    try {
        // get the refresh token from the cookies in the request
        const { refreshToken } = req.signedCookies;
        if (refreshToken === undefined) throw new E.TokenNotFoundError();

        const { account_id } = jwt.verify(refreshToken, cookieSecret);

        const account = await findAccountByIdentifier(account_id);
        if (!account) throw new E.AccountNotFoundError();

        // generate tokens
        const newAccessToken = jwt.sign(
            {
                account_id: account.account_id,
                username: account.username,
                email: account.email,
                admin_level: account.admin_level
            },
            jwtSecret,
            { expiresIn: '6h' }
        );

        const newRefreshToken = jwt.sign(
            { account_id: account.account_id },
            cookieSecret,
            { expiresIn: '3d' }
        );

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            maxAge: 259200000,
            sameSite: 'none'
        });

        res.status(200).json(r.success200({
            access_token: newAccessToken,
            username: account.username,
            email: account.email
        }));

        return next();
    }
    catch (error) {
        return next(error);
    }
};

// ============================================================

module.exports.logout = async (req, res, next) => {
    try {
        // get the refresh token from the cookies in the request
        const { refreshToken } = req.signedCookies;
        if (refreshToken === undefined) throw new E.TokenNotFoundError();

        const { account_id } = jwt.verify(refreshToken, cookieSecret);

        const account = await findAccountByIdentifier(account_id);
        if (!account) throw new E.AccountNotFoundError();

        res.clearCookie('refreshToken');
        res.status(200).send(r.success200());

        return next();
    }
    catch (error) {
        return next(error);
    }
};

// ============================================================

// test the http only cookies
// specifically refresh token
module.exports.readSecureCookies = (req, res, next) => {
    try {
        console.log(req.signedCookies.refreshToken);
        res.status(200).send(req.signedCookies.refreshToken);
        return next();
    }
    catch (error) {
        next(error);
    }
};

// ============================================================

/* SUPER ADMIN LOGIN
module.exports.adminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const account = await findAccountByUsername(username);

        // no account matching username
        if (!account)
            return res.status(404).json({
                message: 'Account not found',
                found: false,
                locked: null,
                token: null,
                data: null
            });

        if (account.admin_level !== ADMIN_LEVELS.SUPER_ADMIN)
            return res.status(403).json({
                message: 'Incorrect login endpoint'
            });

        // because of the one-to-many r/s btw account and passwords,
        // passwords is an array even though theres only one active password
        const {
            password_id,
            password: hash,
            attempts: passwordAttempts
        } = account.passwords[0];

        // if the account is locked or
        // the password has been attempted for more than 5 times
        if (account.status === 'locked' || passwordAttempts > 5)
            return res.status(403).json({
                message: 'Account is locked',
                found: true,
                locked: true,
                token: null,
                data: null
            });

        if (account.status === 'deactivated')
            return res.status(403).json({
                message: 'Account is deactivated'
            });

        const valid = bcrypt.compareSync(password, hash);

        // If password is not valid
        if (!valid) {
            const attempts = passwordAttempts + 1;

            await updatePasswordAttempts(attempts, password_id);

            // lock the account
            if (attempts >= 5) {
                await lockAccount(account);

                return res.status(403).json({
                    message: 'Account is now locked',
                    found: true,
                    locked: true,
                    token: null,
                    data: null
                });
            }

            // incorrect password but less than 5 password attempts
            return res.status(401).json({
                message: 'Invalid password',
                found: true,
                locked: false,
                token: null,
                data: null
            });
        }

        // valid password below

        // reset password attempts
        // avoid unnecessary writing to database
        if (passwordAttempts > 0) await updatePasswordAttempts(0, password_id);

        // generate token
        const token = jwt.sign(
            {
                account_id: account.account_id,
                username: account.username,
                email: account.email,
                admin_level: account.admin_level
            },
            jwtSecret,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            message: 'Success',
            found: true,
            locked: false,
            token,
            data: {
                username: account.username,
                email: account.email
            }
        });

        return next();
    }
    catch (error) {
        return next(error);
    }
}; */
