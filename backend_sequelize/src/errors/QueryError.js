const { BaseError } = require('./BaseError');

class QueryError extends BaseError {
    constructor() {
        super();
        this.name = 'QueryError';
        this.message = 'Query failed';
        this.generic = 'Query failed';
        this.code = 400;
    }
}

class NotFoundError extends QueryError {
    constructor() {
        super();
        this.name = 'NotFoundError';
        this.message = 'Not found';
        this.code = 404;
    }
}

class DuplicateError extends QueryError {
    constructor(column) {
        super();
        this.name = 'DuplicateError';
        this.message = `Duplicate value on ${column}`;
    }
}

module.exports = {
    QueryError,
    NotFoundError,
    DuplicateError
};
