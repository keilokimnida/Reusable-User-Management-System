const { BaseError } = require('./BaseError');

class AccountError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'PasswordError';
        this.generic = 'Account error';
        this.code = 400;
    }
}

class AccountStatusError extends AccountError {
    /**
     * The account is currently [not active]
     */
    constructor(status = 'not active') {
        super(`The account is currently ${status}`);
        this.name = 'AccountStatusError';
        this.generic = 'Account is not active';
        this.code = 403;
        this.status = status;
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
                account_found: true,
                account_status: this.status
            }
        };
        return json;
    }
}

class AccountNotFound extends AccountError {
    constructor() {
        super('Account not found');
        this.name = 'AccountNotFound';
        this.generic = 'Account not found';
        this.code = 404;
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
                account_found: false
            }
        };
        return json;
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
