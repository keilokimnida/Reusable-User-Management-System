const {
    User: { Accounts }
} = require('../schemas/Schemas');

const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports.seeder = async () => {
    const userInsertions = [];

    let firstname = faker.name.firstName();
    let lastname = faker.name.lastName();
    let username = `${firstname}_${lastname}`.toLowerCase();
    // let state = faker.address.state();
    // let postal_code = faker.address.zipCode();

    userInsertions.push({
        firstname,
        lastname,
        username,
        email: `${username}@example.com`,
        admin_level: 1,
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

    // Create 3 normal users
    for (let i = 0; i < 3; i++) {
        let firstname = faker.name.firstName();
        let lastname = faker.name.lastName();
        let username = `${firstname}_${lastname}`.toLowerCase();

        userInsertions.push({
            firstname,
            lastname,
            username,
            email: `${username}@example.com`,
            admin_level: 0,
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

    await Accounts.bulkCreate(userInsertions);
};
