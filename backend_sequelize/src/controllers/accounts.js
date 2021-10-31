const {
    findAllAccounts,
    findOneAccount,
    createAccount,
    updateAccount
} = require('../models/accounts');

const { findActiveSubscription } = require('../models/subscription');
const { createStripeCustomer, updateStripeCustomer } = require('../services/stripe');


const r = require('../utils/response').responses;
const E = require('../errors/Errors');
const validator = require('validator');

module.exports.createAccount = async (req, res, next) => {
    try {
        // i prefer to destructure req.body as it declares what is required for this controller
        const { firstname, lastname, username, email, password } = req.body;

        // stripe customer
        const customer = await createStripeCustomer(email, username);

        const { username: u } = await createAccount({
            firstname, lastname, username, email, password,
            stripe_customer_id: customer.id
        });

        res.status(201).send(r.success201({ username: u }));
        return next();
    }
    catch (error) {
        if (error.original.code === 'ER_DUP_ENTRY')
            return next(new E.DuplicateError('username'));
        return next(error);
    }
};

// ============================================================

module.exports.findAllAccounts = async (req, res, next) => {
    try {
        const accounts = await findAllAccounts();
        const results = accounts.length === 0 ? undefined : accounts;

        res.status(200).send(r.success200(results));
        return next();
    }
    catch (error) {
        return next(error);
    }
};

// ============================================================

module.exports.findAccountByID = async (req, res, next) => {
    try {
        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID))
            throw new E.ParamTypeError('accountID', req.params.accountID, 1);

        const account = await findOneAccount({ where: { account_id: accountID } });
        if (!account) throw new E.AccountNotFoundError();

        const active_subscription = await findActiveSubscription(accountID);

        res.status(200).send(r.success200({ ...account, active_subscription }));
        return next();
    }
    catch (error) {
        return next(error);
    }
};

// ============================================================

// UPDATE

// updates only account details and their address
// does not include updating account (username/password)
module.exports.editAccount = async (req, res, next) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID))
            throw new E.ParamTypeError('accountID', req.params.accountID, 1);

        // If account is not admin and is trying to edit other accounts
        if (decoded.admin_level !== 2 && accountID !== decoded.account_id)
            throw new E.PermissionError();

        let {
            firstname,
            lastname,
            username,
            email,
            status,
            admin_level = null,
            account_status = null
        } = req.body;

        // nobody should be manually locking an account
        if (account_status === 'locked') account_status = null;

        const include = [];

        if (status !== null) include.push('account');

        const account = await findOneAccount({ where: { account_id: accountID } });
        if (!account) throw new E.AccountNotFoundError();

        let details = { firstname, lastname, email };

        // as an admin...
        if (decoded.admin_level === 2) {
            details.status = status;

            // dont allow admin to change their own admin_level
            if (decoded.account_id !== accountID) {
                // just admin_level is from req.body
                if (admin_level !== null) {
                    admin_level = parseInt(admin_level);
                    if (isNaN(admin_level))
                        throw new E.ParamTypeError('admin_level', admin_level, 1);

                    // if (admin_level === 1 || admin_level === 2) return res.status(400).send(r.error400({
                    //     message: "\"admin_level\" invalid value"
                    // }));

                    details.admin_level = admin_level;
                }
            }
        }

        await updateAccount(account.account_id, details);

        if (email) {
            // Update email in Stripe
            await updateStripeCustomer(account.stripe_customer_id, { email });
        }

        if (username) {
            // Update username in Stripe
            await updateStripeCustomer(account.stripe_customer_id, { name: username });
        }

        // update the account status only when its necessary
        if (account_status !== null) {
            // as an admin...
            // can only change the status when the account status is not locked
            // should only be either active or deactivated
            if (decoded.admin_level === 2 && account.status !== 'locked') {
                // prevent the admin from deactivating themself
                if (decoded.account_id === accountID)
                    throw new E.ParamError('Cannot deactivate yourself');

                await account.update({ status: account_status });
            }
        }

        res.status(200).send(r.success200());
        return next();
    }
    catch (error) {
        return next(error);
    }
};
