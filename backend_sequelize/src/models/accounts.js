const { Accounts } = require('../schemas/Accounts');
const { Passwords } = require('../schemas/Passwords');
const bcrypt = require('bcryptjs');

// ============================================================

module.exports.createAccount = async (meta, avatar = null) => {
    let {
        firstname,
        lastname,
        username,
        password
        // address = null
    } = meta;

    const hash = bcrypt.hashSync(password, 10);

    let newAccount;
    try {
        newAccount = await Accounts.create(
            {
                firstname,
                lastname,
                username,
                status: 'active',
                passwords: [{ password: hash }]
            },
            { include: 'passwords' }
        );
    } catch (error) {
        throw error;
    }

    if (avatar) {
        // TODO avatar file upload
    }

    return newAccount;
};

// ============================================================

module.exports.findAccountByUsername = (username) =>
    Accounts.findOne({
        where: { username },
        include: [
            {
                model: Passwords,
                as: 'passwords',
                where: { active: true },
                limit: 1
            }
        ]
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
