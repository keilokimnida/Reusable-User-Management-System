const { findOneAccount } = require('../models/accounts');

const r = require('../utils/response').responses;
const E = require('../errors/Errors');
const { ADMIN_LEVELS, ACCOUNT_STATUSES } = require('../config/enums');

module.exports.checkAccountStatus = async (req, res, next) => {
    try {
        const {
            decoded: { account_id, admin_level }
        } = res.locals.auth;

        // super admin can bypass this check
        if (admin_level === ADMIN_LEVELS.SUPER_ADMIN) return next();

        let where = { account_id };
        let attributes = ['status', 'admin_level'];

        const account = await findOneAccount(where, null, attributes);
        // check if account is active
        if (account.status !== ACCOUNT_STATUSES.ACTIVE) throw E.AccountStatusError(account.status);

        return next();
    }
    catch (error) {
        // custom errors
        if (error instanceof E.BaseError) return res.status(error.code).send(error.toJSON());
        // other errors
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
};
