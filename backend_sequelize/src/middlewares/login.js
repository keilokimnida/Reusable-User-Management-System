// this middleware is for validating a login token

const jwt = require('jsonwebtoken');
const { secret: jwtSecret } = require('../config/config').jwt;

const r = require('../utils/response').responses;
const E = require('../errors/Errors');

module.exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new E.TokenNotFound();

        try {
            var decode = jwt.verify(token, jwtSecret);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError)
                throw new E.TokenExpiredError();

            if (error instanceof jwt.JsonWebTokenError)
                throw new E.TokenBrokenError();

            throw error;
        }

        // store the auth in the request so that the callback chain can access this data if necessary
        // https://expressjs.com/en/api.html#res.locals
        res.locals.auth = { token, decoded: decode };

        return next();
    }
    catch (error) {
        next(error);
    }
};
