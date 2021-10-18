const { BaseError } = require('./BaseError');

class InternalError extends BaseError {
    constructor(error = null) {
        super(error.message ?? 'An internal error has occured');
        this.name = error.name ?? 'InternalError';
        this.generic = 'Internal error';
        this.code = 500;
        this.error = error;
    }
}

module.exports = { InternalError };
