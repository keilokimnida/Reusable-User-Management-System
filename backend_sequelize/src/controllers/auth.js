const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    findAccountBy,
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

// TODO: Implement checking for validating refresh and access token
// perhaps either with redis or dynamodb, we need something that can temporarily store
// some jwt tokens in a database (like a black-/whitelist)
// because when comes time to refresh both tokens, the old tokens may still be valid

// CLIENT LOGIN
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const account = await findAccountBy.username(username, { includePassword: true });
        const activePassword = account.passwords[0];

        // no account matching username
        if (!account) throw new E.AccountNotFoundError();

        // if the account is locked or
        // the password has been attempted for more than 5 times
        if (account.status === ACCOUNT_STATUS.LOCKED || activePassword.attempts > 5)
            throw new E.AccountStatusError(ACCOUNT_STATUS.LOCKED);

        if (account.status === ACCOUNT_STATUS.DEACTIVATED)
            throw new E.AccountStatusError(ACCOUNT_STATUS.DEACTIVATED);

        // Check if password is correct
        const valid = bcrypt.compareSync(password, activePassword.password);

        // If password is not valid
        if (!valid) {
            const attempts = activePassword.attempts + 1;
            await updatePasswordAttempts(activePassword.password_id, attempts);

            // lock the account
            if (attempts >= 5) {
                await lockAccount(account.account_id);
                throw new E.AccountStatusError(ACCOUNT_STATUS.LOCKED);
            }

            // incorrect password but less than 5 password attempts
            throw new E.WrongPasswordError();
        }

        // correct password
        // reset password attempts
        // avoid unnecessary writing to database
        if (activePassword.attempts > 0) await updatePasswordAttempts(activePassword.password_id, 0);

        const accessToken = jwt.sign({
            account_uuid: account.account_uuid,
            username: account.username,
            admin_level: account.admin_level
        }, jwtSecret, { expiresIn: '6h' });

        const refreshToken = jwt.sign({
            account_uuid: account.account_uuid
        }, cookieSecret, { expiresIn: '3d' });

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

module.exports.useRefreshToken = async (req, res, next) => {
    try {
        // get the refresh token from the cookies in the request
        const { refreshToken } = req.signedCookies;
        if (refreshToken === undefined) throw new E.TokenNotFoundError();

        const { account_uuid } = jwt.verify(refreshToken, cookieSecret);

        const account = await findAccountBy.uuid(account_uuid);
        if (!account) throw new E.AccountNotFoundError();

        // generate tokens
        const newAccessToken = jwt.sign(
            {
                account_uuid: account.account_uuid,
                username: account.username,
                admin_level: account.admin_level
            },
            jwtSecret,
            { expiresIn: '6h' }
        );

        const newRefreshToken = jwt.sign(
            { account_uuid: account.account_uuid },
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
        // const { refreshToken } = req.signedCookies;
        // if (refreshToken === undefined) throw new E.TokenNotFoundError();

        // const { account_uuid } = jwt.verify(refreshToken, cookieSecret);

        // const account = await findAccountBy.uuid(account_uuid);
        // if (!account) throw new E.AccountNotFoundError();

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
