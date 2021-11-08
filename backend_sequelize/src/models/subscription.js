const { Op } = require('sequelize');

const {
    User: { PaymentMethods },
    Invoices, Plans, Subscriptions
} = require('../schemas/Schemas');

// Create Subscription
module.exports.createSubscription = (stripeSubscriptionID, planID, accountID, status, meta) =>
    Subscriptions.create({
        ...meta,
        stripe_subscription_id: stripeSubscriptionID,
        fk_plan_id: planID,
        fk_account_id: accountID,
        stripe_status: status
    });

// Update Subscription
module.exports.updateSubscription = (subscriptionID, meta) =>
    Subscriptions.update(meta, {
        where: { stripe_subscription_id: subscriptionID }
    });

// Delete Subscription (Note: Different from canceled subscriptions. Canceled Subscription records remain in the system for archival purposes)
module.exports.deleteSubscription = (subscriptionID) =>
    Subscriptions.destroy({
        where: { stripe_subscription_id: subscriptionID }
    });

// Find active subscriptiobs
// active means subscription status aka stripe_status can be:
// 'active', 'trialing', 'past_due', 'canceling'
module.exports.findActiveSubscription = (accountID) =>
    Subscriptions.findOne({
        where: {
            fk_account_id: accountID,
            stripe_status: {
                [Op.notIn]: ['canceled']
            }
        },
        include: [
            {
                model: Plans,
                as: 'plan'
            },
            {
                model: Invoices,
                as: 'invoice',
                order: [['paid_on', 'ASC']]
            },
            {
                model: PaymentMethods,
                as: 'payment_method'
            }
        ]
    });

// Find all subscriptions by accountID
module.exports.findSubscriptionsByAccountID = (accountID) =>
    Subscriptions.findAll({
        where: {
            fk_account_id: accountID
        },
        include: [{
            model: Invoices,
            as: 'invoice',
            order: [['paid_on', 'DESC']]
        }]
    });
