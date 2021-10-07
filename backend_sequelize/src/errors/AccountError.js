const { BaseError } = require("./BaseError");

class AccountError extends BaseError {
    constructor(message) {
        super(message);
        this.name = "PasswordError";
        this.generic = "Reauthentication required";
        this.code = 401;
    }
}

class AdminError extends AccountError {
    /**
     * User cannot [administrate this action]
     */
    constructor(action = "administrate this action") {
        super(`Employee user cannot ${action}`);
        this.name = "AdminError";
        this.generic = "Forbidden action";
        this.code = 403;
    }
}

class OtpExpiredError extends AccountError {
    constructor() {
        super("OTP has expired");
        this.name = "OtpExpiredError";
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
                otp_found: true,
                otp_expired: true
            }
        };
        return json;
    }
}

class OtpNotFoundError extends AccountError {
    constructor() {
        super("OTP not found");
        this.name = "OtpNotFoundError";
        this.generic = "Not found";
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
                otp_found: false
            }
        };
        return json;
    }
}

class AccountStatusError extends AccountError {
    /**
     * The account is currently [not active]
     */
    constructor(status = "not active") {
        super(`The account is currently ${status}`);
        this.name = "AccountStatusError";
        this.generic = "Forbidden action";
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
                found: true,
                account_status: this.status
            }
        };
        return json;
    }
}

class AccountNotFound extends AccountError {
    constructor() {
        super("Account not found");
        this.name = "AccountNotFound";
        this.generic = "Not found";
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

class InviteNotFoundError extends AccountError {
    constructor() {
        super("Invite not found");
        this.name = "InviteNotFoundError";
        this.generic = "Not found";
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
                invite_found: false
            }
        };
        return json;
    }
}

class PermissionError extends AccountError {
    /**
     * Account does not have permission to [...]
     */
    constructor(action = "perform this action") {
        super(`Employee does not have permission to ${action}`);
        this.name = "PermissionError";
        this.code = 403
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
            }
        };
        return json;
    }
}

module.exports = { AccountError, AdminError, OtpExpiredError, OtpNotFoundError, AccountStatusError, AccountNotFound, InviteNotFoundError, PermissionError };
