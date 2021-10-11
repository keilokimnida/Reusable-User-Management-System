const jwt = require('jsonwebtoken');

const { findAccountByUsernameOrEmail } = require('../models/accounts');
const { createResetToken, changePassword } = require('../models/passwords');

const r = require('../utils/response').responses;
const E = require('../errors/Errors');

const { secret: jwtSecret } = require('../config/config').jwt;
const { sendEmail, templates } = require('../utils/email');

module.exports.forgotPassword = async (req, res) => {
    try {
        const { usernameOrEmail: unique } = req.body;
        const account = await findAccountByUsernameOrEmail(unique);

        const token = createResetToken(account.account_id);

        const name = account.firstname.concat(' ', account.lastname);
        await sendEmail(account.email, 'Forgot Password', templates.forgotPassword(name, token));

        res.status(200).send(r.success200());
    }
    catch (error) {
        // custom errors
        if (error instanceof E.BaseError)
            return res.status(error.code).send(error.toJSON());
        // other errors
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
};

module.exports.changeForgottenPassword = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new E.TokenNotFound();

        const { password: newPassword } = req.body;

        try {
            var { account_id } = jwt.verify(token, jwtSecret);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) throw new E.TokenExpiredError();
            if (error instanceof jwt.JsonWebTokenError) throw new E.TokenBrokenError();
            throw error;
        }

        const account = await changePassword(account_id, newPassword);

        const name = account.firstname.concat(' ', account.lastname);
        sendEmail(account.email, 'Forgot Password', templates.passwordChanged(name))
            .catch((error) => console.log('Email failed to sent', error));

        res.status(200).send(r.success200());
    }
    catch (error) {
        // custom errors
        if (error instanceof E.BaseError)
            return res.status(error.code).send(error.toJSON());
        // other errors
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
};

module.exports.changeLoggedInPassword = async (req, res) => {
    try {
        const { account_id } = res.locals.auth.decoded;
        const { password: newPassword } = req.body;

        const account = await changePassword(account_id, newPassword);

        const name = account.firstname.concat(' ', account.lastname);
        sendEmail(account.email, 'Forgot Password', templates.passwordChanged(name))
            .catch((error) => console.log('Email failed to sent', error));

        res.status(200).send(r.success200());
    }
    catch (error) {
        // custom errors
        if (error instanceof E.BaseError)
            return res.status(error.code).send(error.toJSON());
        // other errors
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
};