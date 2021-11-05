const { findActiveSubscription } = require('../models/subscription');

const E = require('../errors/Errors');
const r = require('../utils/response').responses;

// active means 'subscription status' / 'stripe_status' can be:
// 'active', 'trialing', 'past_due', 'canceling'
module.exports.findActiveSubscription = async (req, res, next) => {
    try {
        const { account_id } = res.locals.account;

        const activeSubscription = await findActiveSubscription(account_id);
        if (!activeSubscription) return res.status(204).send();

        res.status(200).send(r.success200(activeSubscription));
        return next();
    }
    catch (error) {
        return next(error);
    }
};
