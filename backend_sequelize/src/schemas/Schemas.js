const { Accounts } = require('./Accounts');
const { Passwords } = require('./Passwords');
const { CompanyParties, PartyItems } = require('./CompanyParties');

module.exports = {
    Accounts,
    Passwords,
    InterestedParties: {
        Forms: CompanyParties,
        Items: PartyItems
    }
};
