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

module.exports.findAllAccounts = async (where, include, attributes) => await Accounts.findAll({
    where,
    include,
    attributes
})

module.exports.findOneAccount = async (where, include, attributes) => await Accounts.findOne({
    where,
    include,
    attributes
});

module.exports.lockAccount = async (account) => await account.update({
    status: "locked"
});

module.exports.updateAccount = async (account, details) => await account.update(details);