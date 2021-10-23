const { BaseError } = require('../errors/Errors');
const { error500 } = require('../utils/response').responses;

module.exports.errorHandler = (error, req, res, next) => {
    // check if there was already a response
    if (res.headersSent) return;

    // custom errors
    if (error instanceof BaseError)
        return res.status(error.code).send(error.toJSON());

    // other errors
    console.log(error);
    return res.status(500).send(error500(error));
};
