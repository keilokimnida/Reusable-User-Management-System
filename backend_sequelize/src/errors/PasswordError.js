const { BaseError } = require('./BaseError');

class PasswordError extends BaseError {
    constructor() {
        super();
        this.name = 'PasswordError';
        this.message = 'Invalid password';
        this.generic = 'Invalid password';
        this.code = 400;
    }
}

class RepeatPasswordError extends PasswordError {
    constructor() {
        super();
        this.name = 'RepeatPasswordError';
        this.message = 'The password has been used before previously';
    }
}

class PasswordStrengthError extends PasswordError {
    constructor() {
        super();
        this.name = 'PasswordStrengthError';
        this.message = 'The password is not strong enough';
    }
}

class WrongPasswordError extends PasswordError {
    constructor() {
        super();
        this.name = 'WrongPasswordError';
        this.message = 'The password is wrong';
    }
}

module.exports = {
    PasswordError,
    RepeatPasswordError,
    PasswordStrengthError,
    WrongPasswordError
};
