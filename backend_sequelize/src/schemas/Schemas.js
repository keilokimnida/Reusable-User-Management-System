const { Accounts } = require('./Accounts');
const { Passwords, Otps } = require('./Passwords');
const { CompanyParties, PartyItems } = require('./CompanyParties');

module.exports = {
    User: {
        Accounts,
        Passwords,
        Otps
    },
    InterestedParties: {
        Forms: CompanyParties,
        Items: PartyItems
    }
};
