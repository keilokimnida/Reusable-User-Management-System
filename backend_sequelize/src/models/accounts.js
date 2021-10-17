const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Accounts, Passwords } = require('../schemas/Schemas').User;

// ============================================================

module.exports.createAccount = async (meta, avatar) => {
    let { firstname, lastname, username, password } = meta;

    const hash = bcrypt.hashSync(password, 10);

    let newAccount = await Accounts.create({
        firstname,
        lastname,
        username,
        status: 'active',
        passwords: [{ password: hash }]
    }, { include: 'passwords' });

    if (avatar) {
        // TODO avatar file upload
    }

    return newAccount;
};

// ============================================================

module.exports.findAccountByUsername = (username) => Accounts.findOne({
    where: { username },
    include: [{
        model: Passwords,
        as: 'passwords',
        where: { active: true },
        limit: 1
    }]
});

module.exports.findAccountByUsernameOrEmail = (unique) => Accounts.findOne({
    where: {
        [Op.or]: [{ username: unique }, { email: unique }]
    }
});

module.exports.findAllAccounts = (where, include, attributes) =>
    Accounts.findAll({
        where,
        include,
        attributes
    });

module.exports.findOneAccount = (where, include, attributes) =>
    Accounts.findOne({
        where,
        include,
        attributes
    });

module.exports.lockAccount = (account) =>
    account.update({
        status: 'locked'
    });

module.exports.updateAccount = (account, details) => account.update(details);
