const { BaseError } = require("./BaseError");

class PasswordError extends BaseError {
    constructor(message) {
        super(message);
        this.name = "PasswordError";
    }
}

class OtpExpiredError extends PasswordError {
    constructor() {
        super("OTP has expired");
        this.name = "OtpExpiredError";
        this.code = 401;
    }
}

class OtpNotFoundError extends PasswordError {
    constructor() {
        super("OTP not found");
        this.name = "OtpNotFoundError";
        this.code = 401;
    }
}

module.exports = { PasswordError, OtpExpiredError, OtpNotFoundError };
