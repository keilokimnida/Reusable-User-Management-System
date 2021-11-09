// this middleware is for validating if the user has access to data they are trying to access
// only admins can access all data

const { ADMIN_LEVEL, CONTENT_ACCESS_LEVEL, STRIPE_STATUS } = require('../config/enums');

const {
    secretKey: stripeSecret,
    webhookSecret: stripeWebhookSecret
} = require('../config/config').stripe.test;

const stripe = require('stripe')(stripeSecret);

const { findActiveSubscription } = require('../models/subscription');

const E = require('../errors/Errors');

// only super admin can access
module.exports.onlySuperAdminAccess = (req, res, next) => {
    try {
        const { account } = res.locals;

        if (account.admin_level !== ADMIN_LEVEL.SUPER_ADMIN)
            throw new E.AdminError('access this feature');

        return next();
    }
    catch (error) {
        return next(error);
    }
};

// STRIPE ACCESS

// Check whether webhook request is from Stripe
module.exports.verifyStripeWebhookRequest = async (req, res, next) => {
    try {
        if (!stripeWebhookSecret) {
            // TODO STRIPE ERROR
            throw new Error('Webhook secret is not provided');
        }

        // Get the signature sent by Stripe
        try {
            const signature = req.headers['stripe-signature'];
            // FIXME await?
            res.locals.event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);
        }
        catch (error) {
            // TODO STRIPE ERROR
            console.log('Webhook signature verification failed', error.message);
            throw new Error('Webhook signature verification failed');
        }

        return next();
    }
    catch (error) {
        return next(error);
    }
};

// Check whether to allow access to content exclusive to subscribers
// (for reference) Plan types: Normal (no plan), Standard, Premium
//
// NOTE: Admin level does not affect access

// Accessible by Premium and free trial users only
module.exports.checkPremiumAccess = async (req, res, next) => {
    try {
        const { account } = res.locals;
        const accountID = parseInt(account.account_id);

        // Get active subscription information
        // Active can be: "active, canceling, trialing, past_due"
        const activeSubscription = await findActiveSubscription(accountID);

        if (!activeSubscription) {
            // TODO STRIPE ERROR
            return res.status(403).send({ message: 'No active subscriptions!' });
        }

        // FIXME refactor to not be negative
        // Allow premium and free trial user access to premum plan 
        const cannotAccessPremium = activeSubscription.fk_plan_id !== 2 && activeSubscription.stripe_status !== STRIPE_STATUS.TRIALING;

        if (cannotAccessPremium) {
            // TODO STRIPE ERROR
            return res.status(403).send({ message: 'Access only allowed for premium subscribers!' });
        }

        return next();
    }
    catch (error) {
        return next(error);
    }
};

// Accessible by Standard, Premium and free trial users only
module.exports.checkStandardAccess = async (req, res, next) => {
    try {
        const { account } = res.locals;
        const accountID = parseInt(account.account_id);

        // Get active subscription information
        // Active can be: "active, canceling, trialing, past_due"
        const activeSubscription = await findActiveSubscription(accountID);

        if (!activeSubscription) {
            // TODO STRIPE ERROR
            return res.status(403).send({ message: 'No active subscriptions!' });
        }

        // FIXME refactor to not be negative
        // only for paying users
        const cannotAccessContent = activeSubscription.fk_plan_id !== 1 && activeSubscription.fk_plan_id !== 2;

        if (cannotAccessContent) {
            // TODO STRIPE ERROR
            return res.status(403).send({ message: 'Access only allowed for standard, premium subscribers and free trial usere!' });
        }

        return next();
    }
    catch (error) {
        return next(error);
    }
};
