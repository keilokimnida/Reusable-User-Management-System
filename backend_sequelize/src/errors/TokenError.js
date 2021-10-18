const { BaseError } = require('./BaseError');

class TokenError extends BaseError {
    constructor(message, found, broken, expired) {
        super(message);
        this.name = 'TokenError';
        this.generic = 'Invalid JWT';
        this.code = 401;
        this.found = found;
        this.broken = broken;
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
                token_found: this.found,
                token_broken: this.broken,
                token_expired: this.expired
            }
        };
    }
}

class TokenNotFound extends TokenError {
    constructor() {
        super('The token is missing', false);
        this.name = 'TokenNotFound';
    }
}

class TokenBrokenError extends TokenError {
    constructor() {
        super('The token is broken', true, true);
        this.name = 'TokenBrokenError';
    }
}

class TokenExpiredError extends TokenError {
    constructor() {
        super('The token has expired', true, false, true);
        this.name = 'TokenExpiredError';
    }
}

module.exports = {
    TokenError,
    TokenNotFound,
    TokenBrokenError,
    TokenExpiredError
};
