const { BaseError } = require('./BaseError');

class AccountError extends BaseError {
    constructor(found, status) {
        super();
        this.name = 'PasswordError';
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

class AdminError extends AccountError {
    /**
     * User cannot [administrate this action]
     */
    constructor(action = 'perform this action') {
        super();
        this.name = 'AdminError';
        this.message = `User cannot ${action}`;
        this.generic = 'Forbidden action';
        this.code = 403;
    }
}

class PermissionError extends AccountError {
    /**
     * Account does not have permission to [...]
     */
    constructor(action = 'perform this action') {
        super();
        this.name = 'PermissionError';
        this.message = `Employee does not have permission to ${action}`;
        this.generic = 'Forbidden action';
        this.code = 403;
    }
}

module.exports = {
    AccountError,
    AccountStatusError,
    AccountNotFoundError,
    AdminError,
    PermissionError
    
};
