const { BaseError } = require('./BaseError');

class OtpError extends BaseError {
    constructor(found, expired) {
        super();
        this.name = 'OtpError';
        this.message = 'OTP error';
        this.generic = 'OTP error';
        this.code = 400;
        this.found = found;
        this.expired = expired;
    }

    toJSON() {
        return {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
                otp_found: this.found,
                otp_expired: this.expired
            }
        };
    }
}

class OtpNotFoundError extends OtpError {
    constructor() {
        super(false);
        this.name = 'OtpNotFoundError';
        this.message = 'OTP not found';
        this.code = 401;
    }
}

class OtpExpiredError extends OtpError {
    constructor() {
        super(true, true);
        this.name = 'OtpExpiredError';
        this.message = 'OTP has expired';
    }
}

module.exports = {
    OtpError,
    OtpNotFoundError,
    OtpExpiredError
};
