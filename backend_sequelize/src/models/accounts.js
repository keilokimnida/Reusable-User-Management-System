const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Accounts, Passwords } = require('../schemas/Schemas').User;

const { ACCOUNT_STATUSES } = require('../config/enums');

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

module.exports.findAccountByIdentifier = (identifier, password = false) => Accounts.findOne({
    where: {
        [Op.or]: [
            { account_id: identifier },
            { username: identifier },
            { email: identifier }
        ]
    },
    include: password ? [{
        model: Passwords,
        as: 'passwords',
        where: { active: true },
        limit: 1
    }] : []
});

module.exports.findAllAccounts = ({ where, include, attributes, ...others } = {}) => Accounts.findAll({
    where,
    include,
    attributes,
    ...others
});

module.exports.findOneAccount = ({ where, include, attributes, ...others } = {}) => Accounts.findOne({
    where,
    include,
    attributes,
    ...others
});

module.exports.lockAccount = (account_id) => Accounts.update({
    status: ACCOUNT_STATUSES.LOCKED
}, { where: { account_id } });

module.exports.updateAccount = (account_id, details) => Accounts.update(details, { where: account_id });
