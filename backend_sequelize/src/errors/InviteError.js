const { BaseError } = require('./BaseError');

class InviteError extends BaseError {
    constructor(found, expired) {
        super();
        this.name = 'InviteError';
        this.message = 'Invite error';
        this.generic = 'Invite error';
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
                invite_found: this.found,
                invite_expired: this.expired
            }
        };
    }
}

class InviteNotFoundError extends InviteError {
    constructor() {
        super(false);
        this.name = 'InviteNotFoundError';
        this.message = 'Invite not found';
        this.code = 404;
    }


}

class InviteExpiredError extends InviteError {
    constructor() {
        super(true, true);
        this.name = 'InviteNotFoundError';
        this.message = 'Invite has expired';
    }
}

module.exports = {
    InviteError,
    InviteNotFoundError,
    InviteExpiredError
};
