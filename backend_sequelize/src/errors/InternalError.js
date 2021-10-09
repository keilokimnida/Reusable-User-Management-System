const { BaseError } = require('./BaseError');

class InternalError extends BaseError {
    constructor(error = null) {
        super('An internal error has occured');
        this.name = 'InternalError';
        this.generic = 'Internal error';
        this.code = 500;
        this.error = error;
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.error.name,
                message: this.error.message
            }
        };
        return json;
    }
}

module.exports = { InternalError };
