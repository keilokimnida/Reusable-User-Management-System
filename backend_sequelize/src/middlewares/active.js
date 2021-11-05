const { ADMIN_LEVEL, ACCOUNT_STATUS } = require('../config/enums');

const E = require('../errors/Errors');

module.exports.checkAccountStatus = async (req, res, next) => {
    try {
        const { account } = res.locals;

        // super admin can bypass this check
        if (account.admin_level === ADMIN_LEVEL.SUPER_ADMIN) return next();

        // check if account is active
        if (account.status !== ACCOUNT_STATUS.ACTIVE)
            throw new E.AccountStatusError(account.status);

        return next();
    }
    catch (error) {
        return next(error);
    }
};
