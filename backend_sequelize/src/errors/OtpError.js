const { BaseError } = require('./BaseError');

class OtpError extends BaseError {
    constructor(message, found, expired) {
        super(message);
        this.name = 'OtpError';
        this.generic = 'OTP error';
        this.code = found ? 401 : 400;
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

class OtpExpiredError extends OtpError {
    constructor() {
        super('OTP has expired');
        this.name = 'OtpExpiredError';
    }
}

class OtpNotFoundError extends OtpError {
    constructor() {
        super('OTP not found');
        this.name = 'OtpNotFoundError';
    }
}

module.exports = {
    OtpError,
    OtpExpiredError,
    OtpNotFoundError
};
