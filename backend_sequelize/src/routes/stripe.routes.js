const router = require('express').Router();
const stripeController = require('../controllers/stripe');
const subscriptionController = require('../controllers/subscription');
const exclusiveContentController = require('../controllers/exclusiveContent');
// const productController = require('../controllers/product');

// MIDDLEWARES
const { isLoggedIn } = require('../middlewares/auth');
const { verifyStripeWebhookRequest, checkPremiumAccess, checkStandardAccess } = require('../middlewares/access');
// const { calculateProductsTotalPrice } = require('../middlewares/payment');
const { checkIfPlanExist } = require('../middlewares/subscription');

// WEBHOOKS
router.post('/webhooks/stripe', verifyStripeWebhookRequest, stripeController.handleWebhook);

// SUBSCRIPTIONS
router.get('/subscription/active', isLoggedIn, subscriptionController.findActiveSubscription);

// EXCLUSIVE CONTENT
// All users
router.get('/exclusive-contents/all', isLoggedIn, (req, res, next) => exclusiveContentController.findExclusiveContent(req, res, next, 1));

// Premium, standard, free trial users only
router.get('/exclusive-contents/standard', isLoggedIn, checkStandardAccess, (req, res, next) => exclusiveContentController.findExclusiveContent(req, res, next, 2));

// Premium and free trial users only
router.get('/exclusive-contents/premium', isLoggedIn, checkPremiumAccess, (req, res, next) => exclusiveContentController.findExclusiveContent(req, res, next, 3));

// STRIPE PAYMENT

// Create setup intent
router.post('/stripe/setup_intents', isLoggedIn, stripeController.createSetupIntent);

// Create payment method
router.post('/stripe/payment_methods', isLoggedIn, stripeController.createPaymentMethod);

// Delete payment method
router.delete('/stripe/payment_methods/:paymentMethodID', isLoggedIn, stripeController.removePaymentMethod);

// Create Subscription
router.post('/stripe/subscriptions/:type', isLoggedIn, checkIfPlanExist, stripeController.createSubscription);

// Update Subscription Plan
router.put('/stripe/subscriptions/:type', isLoggedIn, checkIfPlanExist, stripeController.updateSubscription);

// Update Subscription Default Payment Method
router.put('/stripe/subscriptions', isLoggedIn, stripeController.updateSubscription);

// Cancel Subscription
router.delete('/stripe/subscriptions', isLoggedIn, stripeController.cancelSubscription);

module.exports = router;
