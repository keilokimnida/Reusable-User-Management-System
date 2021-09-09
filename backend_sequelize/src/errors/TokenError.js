const { BaseError } = require("./BaseError");

class TokenError extends BaseError {
    constructor(message) {
        super(message);
        this.name = "TokenError";
    }
}

class TokenExpiredError extends TokenError {
    constructor() {
        super("The token has expired");
        this.name = "TokenExpiredError";
        this.code = 401;
    }
}

class TokenBrokenError extends TokenError {
    constructor() {
        super("The token is broken");
        this.name = "TokenBrokenError";
        this.code = 401;
    }
}

module.exports = { TokenError, TokenExpiredError, TokenBrokenError };
