const { Accounts } = require("../model_definitions/Accounts");
const { Passwords } = require("../model_definitions/Passwords");

module.exports.findUserByUsername = async (username) => await Accounts.findOne({
    where: { username },
    include: [{
        model: Passwords,
        as: "passwords",
        where: { active: true },
        limit: 1
    }]
});

module.exports.lockAccount = async (account) => await account.update({
    status: "locked"
});