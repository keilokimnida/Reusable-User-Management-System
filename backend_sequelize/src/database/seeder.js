const {
    User: { Accounts },
    Products, Plans, ExclusiveContents
} = require('../schemas/Schemas');

const { createStripeCustomer } = require('../services/stripe');

const faker = require('faker');
const bcrypt = require('bcryptjs');

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

    await Products.create({
        name: 'iTele 15 (Orange) - 128 GB',
        price: '1299.90',
        description: 'Better than Apple.',
        image_link: 'http://localhost:3000/static/media/iphone_15_orange.d6d6f070.jpg'
    });

    await Plans.bulkCreate([
        {
            name: 'Standard',
            price: '9.90',
            description: 'It\'s now or never, sign up now to waste money!',
            // Copy and paste product id and price id from Stripe dashboard
            stripe_product_id: 'prod_KOrxSC360YBZiR',
            stripe_price_id: 'price_1Jk4DlHXFJZDlbxPhKWZwik6'
        },
        {
            name: 'Premium',
            price: '15.90',
            description: 'A slightly more expensive plan than standard plan.',
            // Copy and paste product id and price id from Stripe dashboard
            stripe_product_id: 'prod_KOrvrHij2yIrRi',
            stripe_price_id: 'price_1Jk4BiHXFJZDlbxPnocwx0Xm'
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
