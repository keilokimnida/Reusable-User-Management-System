const faker = require('faker');
const bcrypt = require('bcryptjs');

const {
    User: { Accounts },
    Plans, ExclusiveContents
} = require('../schemas/Schemas');

const { createStripeCustomer } = require('../services/stripe');

const { stripe: STRIPE_CONFIG } = require('../config/config');

module.exports.seeder = async () => {
    const userInsertions = [];

    // the first one is a super admin
    for (let i = 0; i < 2; i++) {
        const firstname = faker.name.firstName();
        const lastname = faker.name.lastName();

        const username = `${firstname}_${lastname}`.toLowerCase();
        const email = `${username}@example.com`;

        const stripeCustomer = await createStripeCustomer(email, username);

        userInsertions.push({
            firstname,
            lastname,
            username,
            email,
            admin_level: i === 0 ? 1 : 0,
            passwords: [{
                password: bcrypt.hashSync('12345678!', 10)
            }],
            // Stripe
            has_trialed: false,
            balance: 0,
            stripe_customer_id: stripeCustomer.id
        });
    }

    await Accounts.bulkCreate(userInsertions, { include: 'passwords' });

    const { standard, premium } = STRIPE_CONFIG.test.subscriptions;
    await Plans.bulkCreate([
        {
            name: 'Standard',
            price: '9.90',
            description: 'It\'s now or never, sign up now to waste money!',
            // Copy and paste product id and price id from Stripe dashboard
            stripe_product_id: standard[0],
            stripe_price_id: standard[1]
        },
        {
            name: 'Premium',
            price: '15.90',
            description: 'A slightly more expensive plan than standard plan.',
            // Copy and paste product id and price id from Stripe dashboard
            stripe_product_id: premium[0],
            stripe_price_id: premium[1]
        }
    ]);

    // Insert Exclusive Contents
    await ExclusiveContents.bulkCreate([
        {
            content: '111',
            access_level: 1
        },
        {
            content: '222',
            access_level: 2
        },
        {
            content: '333',
            access_level: 3
        }
    ]);
};
