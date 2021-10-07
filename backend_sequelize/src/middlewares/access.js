// this middleware is for validating if the user has access to data they are trying to access
// only admins can access all data

const E = require('../errors/Errors');
const { responses: r } = require('../utils/response');

// only super admin can access
module.exports.onlySuperAdminAccess = (req, res, next) => {
    try {
        const { decoded } = res.locals.auth;

        // admin level 1 is super admin
        if (decoded.admin_level !== 1) E.AdminError('access this feature');

        return next();
    } catch (error) {
        // custom errors
        if (error instanceof E.BaseError) return res.status(error.code).send(error.toJSON());
        // other errors
        console.log(error);
        return res.status(500).send(r.error500(error));
    }
};
