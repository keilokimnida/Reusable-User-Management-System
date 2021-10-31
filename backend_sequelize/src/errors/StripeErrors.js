const { BaseError } = require('./BaseError');

class StripeError extends BaseError {
    constructor() {
        super();
        this.name = 'StripeError';
        this.message = '';
        this.generic = '';
        this.code = 400;
    }
}

module.exports = {
    StripeError
};
