const { BaseError } = require('./BaseError');

class TokenError extends BaseError {
    constructor(found, broken, expired) {
        super();
        this.name = 'TokenError';
        this.message = 'Invalid JWT';
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

class TokenNotFoundError extends TokenError {
    constructor() {
        super(false);
        this.name = 'TokenNotFoundError';
        this.message = 'The token is missing';
    }
}

class TokenBrokenError extends TokenError {
    constructor() {
        super(true, true);
        this.name = 'TokenBrokenError';
        this.message = 'The token is broken';
    }
}

class TokenExpiredError extends TokenError {
    constructor() {
        super(true, false, true);
        this.name = 'TokenExpiredError';
        this.message = 'The token has expired';
    }
}

module.exports = {
    TokenError,
    TokenNotFoundError,
    TokenBrokenError,
    TokenExpiredError
};
