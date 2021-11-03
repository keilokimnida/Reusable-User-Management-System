const { BaseError } = require('./BaseError');

class AccountError extends BaseError {
    constructor(found, status) {
        super();
        this.name = 'AccountError';
        this.message = 'Account error';
        this.generic = 'Account error';
        this.code = 400;
        this.found = found;
        this.status = status;
    }

    toJSON() {
        return {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
                account_found: this.found,
                account_status: this.status
            }
        };
    }
}

class AccountNotFoundError extends AccountError {
    constructor() {
        super(false);
        this.name = 'AccountNotFoundError';
        this.message = 'Account not found';
        this.code = 404;
    }
}

class AccountStatusError extends AccountError {
    /**
     * The account is currently [not active]
     */
    constructor(status) {
        super(true, status);
        this.name = 'AccountStatusError';
        this.message = 'The account is currently not active';
        this.code = 403;
    }
}

module.exports = {
    AccountError,
    AccountStatusError,
    AccountNotFoundError
};
