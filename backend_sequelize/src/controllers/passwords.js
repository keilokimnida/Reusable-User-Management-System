const { findAccountByUsernameOrEmail } = require('../models/accounts');

const {
    createResetToken,
    validateResetToken,
    useResetTokens,
    changePassword
} = require('../models/passwords');

const r = require('../utils/response').responses;
const E = require('../errors/Errors');

const { sendEmail, templates } = require('../utils/email');

module.exports.forgotPassword = async (req, res, next) => {
    try {
        const { usernameOrEmail: unique } = req.body;
        const account = await findAccountByUsernameOrEmail(unique);

        const { token } = await createResetToken(account.account_id);

        const name = account.firstname.concat(' ', account.lastname);
        await sendEmail(
            account.email,
            'Forgot Password',
            templates.forgotPassword(name, token)
        );

        res.status(200).send(r.success200());
        return next();
    }
    catch (error) {
        return next(error);
    }
};

module.exports.changeForgottenPassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new E.TokenNotFound();

        const { password: newPassword } = req.body;
        const { account_id } = validateResetToken(token);

        const account = await changePassword(account_id, newPassword);

        // remove all reset tokens for this account
        await useResetTokens(account_id);

        const name = account.firstname.concat(' ', account.lastname);
        sendEmail(account.email, 'Forgot Password', templates.passwordChanged(name))
            .catch((error) => console.log('Email failed to sent', error));

        res.status(200).send(r.success200());
        return next();
    }
    catch (error) {
        return next(error);
    }
};

module.exports.changeLoggedInPassword = async (req, res, next) => {
    try {
        const { account_id } = res.locals.auth.decoded;
        const { password: newPassword } = req.body;

        const account = await changePassword(account_id, newPassword);

        const name = account.firstname.concat(' ', account.lastname);
        sendEmail(account.email, 'Forgot Password', templates.passwordChanged(name))
            .catch((error) => console.log('Email failed to sent', error));

        res.status(200).send(r.success200());
        return next();
    }
    catch (error) {
        return next(error);
    }
};
