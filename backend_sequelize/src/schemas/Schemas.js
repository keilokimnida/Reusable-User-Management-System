const { Accounts } = require('./Accounts');
const { Registrations } = require('./Registrations');
const { Passwords, Otps } = require('./Passwords');
const { PaymentMethods, Accounts_PaymentMethods } = require('./PaymentMethods');
const { Plans } = require('./Plans');
const { Subscriptions } = require('./Subscriptions');
const { Invoices } = require('./Invoices');
const { ExclusiveContents } = require('./ExclusiveContents');

module.exports = {
    User: {
        Accounts,
        Registrations,
        Passwords,
        Otps,
        PaymentMethods,
        Accounts_PaymentMethods
    },
    Plans, Subscriptions, Invoices, ExclusiveContents
};
