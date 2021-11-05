const {
    findAllAccounts,
    findAccountBy,
    createAccount
} = require('../models/accounts');

const { findActiveSubscription } = require('../models/subscription');
const { createStripeCustomer, updateStripeCustomer } = require('../services/stripe');

const { ADMIN_LEVEL } = require('../config/enums');

const r = require('../utils/response').responses;
const E = require('../errors/Errors');
// const validator = require('validator');

module.exports.createAccount = async (req, res, next) => {
    try {
        // i prefer to destructure req.body as it declares what is required for this controller
        const { firstname, lastname, username, email, password } = req.body;

        // stripe customer
        const customer = await createStripeCustomer(email, username);

        const { username: uname } = await createAccount({
            firstname, lastname, username, email, password,
            stripe_customer_id: customer.id
        });

        res.status(201).send(r.success201({ username: uname }));
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
        const accounts = await findAllAccounts({
            attributes: { exclude: ['account_id'] }
        });
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
        const accountUUID = parseInt(req.params.accountID);

        const account = await findAccountBy.uuid(accountUUID, { attributes: { exclude: ['account_id'] } });
        if (!account) throw new E.AccountNotFoundError();

        const active_subscription = await findActiveSubscription(account.account_id);

        res.status(200).send(r.success200({ ...account.toJSON(), active_subscription }));
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
        const { account } = res.locals;

        const accountUUID = parseInt(req.params.accountID);

        const isSelf = account.account_uuid === accountUUID;

        // if account is user and is trying to edit other accounts
        if (account.admin_level === ADMIN_LEVEL.USER && !isSelf)
            throw new E.PermissionError();

        const {
            firstname,
            lastname,
            username,
            email,
            status,
            admin_level
        } = req.body;

        const toBeEdited = await findAccountBy.uuid(accountUUID);
        if (!toBeEdited) throw new E.AccountNotFoundError();

        const details = { firstname, lastname, username, email };

        // as admin
        if (decoded.admin_level !== ADMIN_LEVEL.USER) {
            // cannot manually set locked status
            if (status === 'locked')
                throw new E.ParamValueError('status');

            details.status = status;

            // cannot change own admin level
            if (!isSelf) {
                const alvl = parseInt(admin_level);

                if (isNaN(alvl))
                    throw new E.ParamTypeError('admin_level', admin_level, 1);

                details.admin_level = alvl;
            }
        }

        await toBeEdited.update(details);

        // Update email in Stripe
        if (email) await updateStripeCustomer(account.stripe_customer_id, { email });

        // Update username in Stripe
        if (username) await updateStripeCustomer(account.stripe_customer_id, { name: username });

        res.status(200).send(r.success200());
        return next();
    }
    catch (error) {
        return next(error);
    }
};
