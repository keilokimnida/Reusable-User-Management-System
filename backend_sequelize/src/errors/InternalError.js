const { BaseError } = require('./BaseError');

class InternalError extends BaseError {
    constructor(error) {
        super();
        this.name = error.name ?? 'InternalError';
        this.message = error.message ?? 'An internal error has occured';
        this.generic = 'Internal error';
        this.code = 500;
        this.original = error;
    }
}

module.exports = { InternalError };
