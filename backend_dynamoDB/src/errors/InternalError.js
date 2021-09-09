const { BaseError } = require("./BaseError");

class InternalError extends BaseError {
    constructor(error = null) {
        super("An internal error has occured");
        this.name = "InternalError"
        this.error = error;
        this.code = 500;
    }

    toJSON() {
        let json = {
            name: this.name,
            message: this.message,
            error: this.error.toString?.() ?? "Unknown error"
        };
        return json;
    }
}

module.exports = { InternalError };
