module.exports = {
    ADMIN_LEVEL: {
        USER: 0,
        SUPER_ADMIN: 1,
        ADMIN: 2
    },
    ACCOUNT_STATUS: {
        // active is the default state for the account
        ACTIVE: 'active',
        // locked is when the password is invalidated
        LOCKED: 'locked',
        // deactivated is when the account is closed, but the associated account is not deleted for record tracking purposes
        DEACTIVATED: 'deactivated'
    },
    CONTENT_ACCESS_LEVEL: {
        // all users
        ALL: 1,
        // standard, premium and free trial users only
        STANDARD: 2,
        // premium and free trial users only
        PREMIUM: 3
    },
    STRIPE_STATUS: {
        ACTIVE: 'active',
        CANCELED: 'canceled',
        CANCELING: 'canceling',
        TRIALING: 'trialing',
        PAST_DUE: 'past_due'
    },
    STRIPE_PAYMENT_INTENT_STATUS: {
        SUCCEEDED: 'succeeded',
        REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
        REQUIRES_ACTION: 'requires_action',
        CANCELED: 'canceled',
        INCOMPLETE: 'incomplete'
    }
};
