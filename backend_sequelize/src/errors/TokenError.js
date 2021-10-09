const { BaseError } = require('./BaseError');

class TokenError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'TokenError';
        this.generic = 'Token error';
        this.code = 401;
    }
}

class TokenExpiredError extends TokenError {
    constructor() {
        super('The token has expired');
        this.name = 'TokenExpiredError';
    }
}

class TokenBrokenError extends TokenError {
    constructor() {
        super('The token is broken');
        this.name = 'TokenBrokenError';
    }
}

class TokenNotFound extends TokenError {
    constructor() {
        super('The token is missing');
        this.name = 'TokenNotFound';
        this.code = 400;
    }
}

module.exports = {
    TokenError,
    TokenExpiredError,
    TokenBrokenError,
    TokenNotFound
};
