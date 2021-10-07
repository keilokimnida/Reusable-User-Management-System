const { Passwords } = require('../schemas/Passwords');

module.exports.updatePasswordAttempts = (attempts, password_id) =>
    Passwords.update({ attempts }, { where: { password_id } });
