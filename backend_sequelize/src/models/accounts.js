const { Accounts } = require("../model_definitions/Accounts");

module.exports.findUserByUsername = (username) => await Accounts.findOne({
    where: { username },
    include: [{
        model: Passwords,
        as: "passwords",
        where: { active: true },
        limit: 1
    }]
});

module.exports.lockAccount = (account) => await account.update({
    status: "locked"
});