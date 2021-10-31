const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Accounts, Passwords, PaymentMethods } = require('../schemas/Schemas').User;

const { ACCOUNT_STATUS } = require('../config/enums');

// ============================================================

module.exports.createAccount = async (meta, avatar) => {
    const {
        firstname, lastname, username, email, password,
        stripe_customer_id
    } = meta;

    const hash = bcrypt.hashSync(password, 10);

    const newAccount = await Accounts.create({
        firstname, lastname, username, email,
        status: 'active',
        passwords: [{ password: hash }],
        // stripe
        has_trialed: false,
        balance: 0,
        stripe_customer_id
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

module.exports.findAllAccounts = ({ where, include, attributes, ...others } = {}) =>
    Accounts.findAll({
        where,
        include,
        attributes,
        ...others
    });

module.exports.findOneAccount = ({ where, include, attributes, ...others } = {}) =>
    Accounts.findOne({
        where,
        include,
        attributes,
        ...others
    });

module.exports.findAccountByStripeCustID = (stripeCustomerID) =>
    Accounts.findOne({
        where: {
            stripe_customer_id: stripeCustomerID
        },
        include: [{
            model: PaymentMethods,
            as: 'payment_accounts'
        }]
    });

module.exports.lockAccount = (account_id) =>
    Accounts.update({
        status: ACCOUNT_STATUS.LOCKED
    }, { where: { account_id } });

module.exports.updateAccount = (account_id, details) =>
    Accounts.update(details, { where: account_id });
