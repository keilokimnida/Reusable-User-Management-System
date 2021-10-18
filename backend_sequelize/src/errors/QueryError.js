const { BaseError } = require('./BaseError');

class QueryError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'QueryError';
        this.generic = 'Query failed';
        this.code = 400;
    }
}

class NotFoundError extends QueryError {
    constructor() {
        super('Not found');
        this.name = 'NotFoundError';
        this.code = 404;
    }
}

class DuplicateError extends QueryError {
    constructor(column) {
        super(`Duplicate value on ${column}`);
        this.name = 'DuplicateError';
    }
}

module.exports = {
    QueryError,
    NotFoundError,
    DuplicateError
};
