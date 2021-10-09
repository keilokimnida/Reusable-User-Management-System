const { BaseError } = require('./BaseError');

class PasswordError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'PasswordError';
        this.generic = 'Provided password is invalid';
        this.code = 400;
    }
}

class RepeatPasswordError extends PasswordError {
    constructor() {
        super('The password has been used before previously');
        this.name = 'RepeatPasswordError';
    }
}

class PasswordStrengthError extends PasswordError {
    constructor() {
        super('The password is not strong enough');
        this.name = 'PasswordStrengthError';
    }
}

module.exports = { PasswordError, RepeatPasswordError, PasswordStrengthError };
