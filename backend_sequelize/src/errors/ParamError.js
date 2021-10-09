const { BaseError } = require('./BaseError');

class ParamError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'ParamError';
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
        super(`Parameter '${paramName}' expected a ${Object.prototype.toString.call(expectedValue)} but got a ${Object.prototype.toString.call(paramValue)}`);
        this.name = 'ParamTypeError';
    }
}

class ParamMissingError extends ParamError {
    constructor(paramName) {
        super(`Parameter '${paramName}' is missing`);
        this.name = 'ParamMissingError';
    }
}

class ParamValueError extends ParamError {
    /**
     * Parameter '[...]' has an invalid value [expected ...]
     */
    constructor(paramName, correct) {
        let msg = `Parameter '${paramName}' has an invalid value`;
        if (correct) msg += `, expected ${correct}`;
        super(msg);
        this.name = 'ParamValueError';
    }
}

module.exports = { ParamError, ParamTypeError, ParamMissingError, ParamValueError };
