const { Accounts, Passwords, InterestedParties } = require('../schemas/Schemas');

module.exports.findActivePartyDoc = () =>
    InterestedParties.Forms.findOne({
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
        order: [[InterestedParties.Forms.associations.items, 'display_order', 'ASC']]
    });
