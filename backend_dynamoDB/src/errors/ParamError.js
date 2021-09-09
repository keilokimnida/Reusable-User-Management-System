const { BaseError } = require("./BaseError");

class ParamError extends BaseError {
    constructor(message) {
        super(message);
        this.name = "ParamError";
    }
}

class ParamTypeError extends ParamError {
    constructor(paramName, paramValue, paramType) {
        super(`Parameter "${paramName}" expected a ${paramType} but got a ${Object.prototype.toString.call(paramValue)}`);
        this.name = "ParamError";
        this.code = 400;
    }
}

class ParamMissingError extends ParamError {
    constructor(paramName) {
        super(`Parameter "${paramName}" is missing`);
        this.name = "ParamMissingError";
        this.code = 400;
    }
}

class ParamValueError extends ParamError {
    constructor(paramName, paramValue) {
        super(`Parameter "${paramName}" has an invalid value of ${paramValue}`);
        this.name = "ParamValueError";
        this.code = 400;
    }
}

module.exports = { ParamError, ParamTypeError, ParamMissingError, ParamValueError };
