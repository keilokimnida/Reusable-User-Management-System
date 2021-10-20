const { BaseError } = require('./BaseError');

class ParamError extends BaseError {
    constructor() {
        super();
        this.name = 'ParamError';
        this.message = 'Request syntax error';
        this.generic = 'Request syntax error';
        this.code = 400;
    }
}

class ParamTypeError extends ParamError {
    /**
     * Parameter '[...]' expected a [...] but got a [...]
     * @param {string} paramName The name of the parameter
     * @param {*} paramValue The invalid value received
     * @param {*} expectedValue An example value to derive its type from
     */
    constructor(paramName, paramValue, expectedValue) {
        super();
        this.name = 'ParamTypeError';
        this.message = `Parameter '${paramName}' expected a ${Object.prototype.toString.call(expectedValue)} but got a ${Object.prototype.toString.call(paramValue)}`;
    }
}

class ParamMissingError extends ParamError {
    constructor(paramName) {
        super();
        this.name = 'ParamMissingError';
        this.message = `Parameter '${paramName}' is missing`;
    }
}

class ParamValueError extends ParamError {
    /**
     * Parameter '[...]' has an invalid value [expected ...]
     */
    constructor(paramName, correct) {
        super();
        this.name = 'ParamValueError';
        
        let msg = `Parameter '${paramName}' has an invalid value`;
        if (correct) msg += `, expected ${correct}`;
        this.message = msg;
    }
}

module.exports = { ParamError, ParamTypeError, ParamMissingError, ParamValueError };
