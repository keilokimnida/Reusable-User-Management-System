// this middleware is for validating a login token

const jwt = require('jsonwebtoken');

const { secret: jwtSecret } = require('../config/config').jwt;

const E = require('../errors/Errors');
const { findAccountBy } = require('../models/accounts');

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new E.TokenNotFoundError();

        let decoded;

        try {
            decoded = jwt.verify(token, jwtSecret);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError)
                throw new E.TokenExpiredError();

            if (error instanceof jwt.JsonWebTokenError)
                throw new E.TokenBrokenError();

            throw error;
        }

        // Find account_id
        const account = await findAccountBy.AccountId(decoded.account_id);
        const accountID = account.account_id;

        // store the auth in the request so that the callback chain can access this data if necessary
        // https://expressjs.com/en/api.html#res.locals
        res.locals.auth = { token, decoded, accountID };

        return next();
    }
    catch (error) {
        return next(error);
    }
};
