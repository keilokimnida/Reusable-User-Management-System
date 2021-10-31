const { Accounts } = require('./Accounts');
const { Passwords, Otps } = require('./Passwords');
const { PaymentMethods, Accounts_PaymentMethods } = require('./PaymentMethods');
const { Plans } = require('./Plans');
const { Subscriptions } = require('./Subscriptions');
const { Invoices } = require('./Invoices');
const { Products } = require('./Products');
const { ExclusiveContents } = require('./ExclusiveContents');

module.exports = {
    User: {
        Accounts,
        Passwords,
        Otps,
        PaymentMethods,
        Accounts_PaymentMethods
    },
    Plans, Subscriptions, Invoices,
    Products, ExclusiveContents
};
