const { BaseError } = require('./BaseError');

class AccountError extends BaseError {
    constructor(message, found, status) {
        super(message);
        this.name = 'PasswordError';
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

class AccountNotFound extends AccountError {
    constructor() {
        super('Account not found', false);
        this.name = 'AccountNotFound';
        this.code = 404;
    }
}

class AccountStatusError extends AccountError {
    /**
     * The account is currently [not active]
     */
    constructor(status) {
        super('The account is currently not active', true, status);
        this.name = 'AccountStatusError';
        this.code = 403;
    }
}

class AdminError extends AccountError {
    /**
     * User cannot [administrate this action]
     */
    constructor(action = 'perform this action') {
        super(`User cannot ${action}`);
        this.name = 'AdminError';
        this.generic = 'Forbidden action';
        this.code = 403;
    }
}

class PermissionError extends AccountError {
    /**
     * Account does not have permission to [...]
     */
    constructor(action = 'perform this action') {
        super(`Employee does not have permission to ${action}`);
        this.name = 'PermissionError';
        this.generic = 'Forbidden action';
        this.code = 403;
    }
}

module.exports = {
    AccountError,
    AccountStatusError,
    AccountNotFound,
    AdminError,
    PermissionError
};
