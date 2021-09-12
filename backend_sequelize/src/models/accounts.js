const { Accounts } = require("../model_definitions/Accounts");
const { Passwords } = require("../model_definitions/Passwords");

module.exports.findAccountByUsername = async (username) => await Accounts.findOne({
    where: { username },
    include: [{
        model: Passwords,
        as: "passwords",
        where: { active: true },
        limit: 1
    }]
});

module.exports.findAllAccounts = async (where, include) => await Accounts.findAll({
    where,
    include
})

module.exports.findOneAccount = async (where, include) => await Accounts.findOne({
    where,
    include
});

module.exports.lockAccount = async (account) => await account.update({
    status: "locked"
});

module.exports.updateAccount = async (account, details) => await account.update(details);