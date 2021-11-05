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

const includeActivePassword = (bool) => bool
    ? [{ association: 'passwords', where: { active: true }, limit: 1 }]
    : [];

// typescript
// type Identifier = 'account_id' | 'account_uuid' | 'username' | 'email';

module.exports.findAccountBy = {
    AccountId: (account_id, password = false) => Accounts.findOne({
        where: { account_id },
        include: includeActivePassword(password)
    }),
    AccountUuid: (account_uuid, password = false) => Accounts.findOne({
        where: { account_uuid },
        include: includeActivePassword(password)
    }),
    Username: (username, password = false) => Accounts.findOne({
        where: { username },
        include: includeActivePassword(password)
    }),
    Email: (email, password = false) => Accounts.findOne({
        where: { email },
        include: includeActivePassword(password)
    }),
    StripeCustomerId: (stripe_customer_id, paymentMethods = true) => Accounts.findOne({
        where: { stripe_customer_id },
        include: paymentMethods ? [{ association: 'payment_accounts' }] : []
    }),
    /** 
     * Finds one account with a value across multiple columns/identifiers
     * @param {Array} identifiers Columns in model
     * @param {any} value Unique value
     * @param {boolean} password To include the active password
     */
    Identifiers: (identifiers = [], value, password = false) => Accounts.findOne({
        where: { [Op.or]: identifiers.map((identifer) => ({ [identifer]: value })) },
        include: includeActivePassword(password)
    })
};

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

module.exports.lockAccount = (account_id) =>
    Accounts.update({
        status: ACCOUNT_STATUS.LOCKED
    }, { where: { account_id } });

module.exports.updateAccount = (account_id, details) =>
    Accounts.update(details, { where: account_id });
