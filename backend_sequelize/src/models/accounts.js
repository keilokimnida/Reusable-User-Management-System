const { Accounts } = require("../model_definitions/Accounts");
const { Passwords } = require("../model_definitions/Passwords");
const bcrypt = require("bcryptjs");

// ============================================================

module.exports.createAccount = async (meta, avatar = null) => {
    let {
        firstname, lastname,
        username, password,
        // address = null
    } = meta;

    const hash = bcrypt.hashSync(password, 10);

    let newAccount;
    try {
        newAccount = await Accounts.create({
            firstname, lastname,
            username,
            status: "active",
            passwords: [{ password: hash }]
        }, { include: "passwords" });
    }
    catch (error) {
        throw error;
    }

    if (avatar) {
        // TODO avatar file upload
    };

    return newAccount;
}

// ============================================================

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