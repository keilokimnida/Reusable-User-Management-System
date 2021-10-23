const {
    User: { Accounts }
} = require('../schemas/Schemas');

const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports.seeder = async () => {
    const userInsertions = [];

    // create 10 users
    // the first one a super admin
    for (let i = 0; i < 10; i++) {
        let firstname = faker.name.firstName();
        let lastname = faker.name.lastName();
        let username = `${firstname}_${lastname}`.toLowerCase();

        userInsertions.push({
            firstname,
            lastname,
            username,
            email: `${username}@example.com`,
            admin_level: i === 0 ? 1 : 0,
            passwords: [{
                password: bcrypt.hashSync('12345678!', 10)
            }]
            // address: {
            //     address_line_one: faker.address.streetAddress(),
            //     address_line_two: `${state} ${postal_code}`,
            //     city: faker.address.city(),
            //     state,
            //     country: faker.address.country(),
            //     postal_code
            // }
        });
    }

    await Accounts.bulkCreate(userInsertions, { include: 'passwords' });
};
