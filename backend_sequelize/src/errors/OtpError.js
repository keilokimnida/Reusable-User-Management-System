const { BaseError } = require('./BaseError');

class OtpError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'OtpError';
        this.generic = 'OTP error';
        this.code = 401;
    }
}

class OtpExpiredError extends OtpError {
    constructor() {
        super('OTP has expired');
        this.name = 'OtpExpiredError';
        this.generic = 'Expired OTP';
        this.code = 401;
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

class OtpNotFoundError extends OtpError {
    constructor() {
        super('OTP not found');
        this.name = 'OtpNotFoundError';
        this.generic = 'Not found';
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

module.exports = {
    OtpError,
    OtpExpiredError,
    OtpNotFoundError
};
