const { Accounts } = require('./Accounts');
const { Passwords, Otps } = require('./Passwords');

module.exports = {
    User: {
        Accounts,
        Passwords,
        Otps
    }
};
