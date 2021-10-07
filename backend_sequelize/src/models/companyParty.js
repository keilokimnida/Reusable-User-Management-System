const { CompanyParties, PartyItems } = require('../schemas/CompanyParties');
const { Accounts } = require('../schemas/Accounts');

module.exports.findActivePartyDoc = () =>
    CompanyParties.findOne({
        where: {
            status: 'active'
        },
        include: [
            {
                model: Accounts,
                as: 'author',
                attributes: ['username']
            },
            {
                model: Accounts,
                as: 'approver',
                attributes: ['username']
            },
            'items'
        ],
        order: [[CompanyParties.associations.items, 'display_order', 'ASC']]
    });
