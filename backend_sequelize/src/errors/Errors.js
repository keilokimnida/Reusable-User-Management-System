const AccountError = require('./AccountError');
const BaseError = require('./BaseError');
const InternalErrors = require('./InternalError');
const InviteErrors = require('./InviteError');
const OtpErrors = require('./OtpError');
const ParamErrors = require('./ParamError');
const PasswordErrors = require('./PasswordError');
const QueryErrors = require('./QueryError');
const TokenErrors = require('./TokenError');

module.exports = {
    ...AccountError,
    ...BaseError,
    ...InternalErrors,
    ...InviteErrors,
    ...OtpErrors,
    ...ParamErrors,
    ...PasswordErrors,
    ...QueryErrors,
    ...TokenErrors
};
