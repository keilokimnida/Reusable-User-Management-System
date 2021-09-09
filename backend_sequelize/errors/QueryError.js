const { BaseError } = require("./BaseError");

class QueryError extends BaseError {
    constructor(message) {
        super(message);
        this.name = "QueryError";
    }
}

class NotFoundError extends QueryError {
    constructor() {
        super("Not found");
        this.name = "NotFoundError";
        this.name = 404;
    }
}

module.exports = { QueryError, NotFoundError };
