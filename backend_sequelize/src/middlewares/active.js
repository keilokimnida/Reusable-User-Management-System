const { findOneAccount } = require('../models/accounts');

const { ADMIN_LEVEL, ACCOUNT_STATUS } = require('../config/enums');

const E = require('../errors/Errors');

module.exports.checkAccountStatus = async (req, res, next) => {
    try {
        const {
            decoded: { account_id, admin_level }
        } = res.locals.auth;

        // super admin can bypass this check
        if (admin_level === ADMIN_LEVEL.SUPER_ADMIN) return next();

        const search = {
            where: { account_id },
            attributes: ['status', 'admin_level']
        };

        const account = await findOneAccount(search);

        // check if account is active
        if (account.status !== ACCOUNT_STATUS.ACTIVE)
            throw new E.AccountStatusError(account.status);

        return next();
    }
    catch (error) {
        return next(error);
    }
};
