const { findActiveSubscription } = require('../models/subscription');

const E = require('../errors/Errors');
const r = require('../utils/response').responses;

// active means 'subscription status' / 'stripe_status' can be:
// 'active', 'trialing', 'past_due', 'canceling'
module.exports.findActiveSubscription = async (req, res, next) => {
    try {
        const { decoded } = res.locals.auth;
        const accountID = parseInt(decoded.account_id);
        if (isNaN(accountID))
            throw new E.ParamTypeError('accountID', accountID, 1);

        const activeSubscription = await findActiveSubscription(accountID);
        if (!activeSubscription) return res.status(204).send();

        res.status(200).send(r.success200(activeSubscription));
        return next();
    }
    catch (error) {
        return next(error);
    }
};
