const DocumentErrors = require("./DocumentError");
const EmployeeErrors = require("./EmployeeError");
const InternalErrors = require("./InternalError");
const ParamErrors = require("./ParamError");
const PasswordErrors = require("./PasswordError");
const QueryErrors = require("./QueryError");
const TokenErrors = require("./TokenError");

module.exports = {
    ...DocumentErrors,
    ...EmployeeErrors,
    ...InternalErrors,
    ...ParamErrors,
    ...PasswordErrors,
    ...QueryErrors,
    ...TokenErrors
}
