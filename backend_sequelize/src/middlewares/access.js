// this middleware is for validating if the user has access to data they are trying to access
// only admins can access all data

const { ADMIN_LEVELS } = require('../config/enums');

const E = require('../errors/Errors');

// only super admin can access
module.exports.onlySuperAdminAccess = (req, res, next) => {
    try {
        const { decoded } = res.locals.auth;
        if (decoded.admin_level !== ADMIN_LEVELS.SUPER_ADMIN)
            throw E.AdminError('access this feature');

        return next();
    }
    catch (error) {
        return next(error);
    }
};
