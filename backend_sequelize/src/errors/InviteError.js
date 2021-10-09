const { BaseError } = require('./BaseError');

class InviteError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'InviteError';
        this.generic = 'Invite error';
        this.code = 400;
    }
}

class InviteNotFoundError extends InviteError {
    constructor() {
        super('Invite not found');
        this.name = 'InviteNotFoundError';
        this.generic = 'Invite not found';
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
                invite_found: false
            }
        };
        return json;
    }
}

class InviteExpiredError extends InviteError {
    constructor() {
        super('Invite has expired');
        this.name = 'InviteNotFoundError';
        this.generic = 'Invite has expired';
        this.code = 400;
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message,
                invite_expired: true
            }
        };
        return json;
    }
}

module.exports = {
    InviteError,
    InviteNotFoundError,
    InviteExpiredError
};
