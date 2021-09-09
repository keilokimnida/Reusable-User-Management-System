const { Passwords } = require("../model_definitions/Passwords");

module.exports.updatePasswordAttempts = (attempts, password_id) => await Passwords.update({
    attempts,
}, {
    where: { password_id }
});