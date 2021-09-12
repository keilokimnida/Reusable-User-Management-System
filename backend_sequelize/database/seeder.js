const { Accounts } = require("../src/model_definitions/Accounts");
const { Passwords } = require("../src/model_definitions/Passwords");

const c = require("../src/utils/cloudinary");
const faker = require("faker");
const bcrypt = require("bcryptjs");

module.exports.seeder = async () => {
    try {
        let firstname = faker.name.firstName();
        let lastname = faker.name.lastName();
        let username = `${firstname}_${lastname}`.toLowerCase();
        // let state = faker.address.state();
        // let postal_code = faker.address.zipCode();

        await Accounts.create({
            firstname,
            lastname,
            username,
            email: `${username}@example.com`,
            passwords: [{
                password: bcrypt.hashSync("12345678!", 10)
            }],
            admin_level: 1
            // address: {
            //     address_line_one: faker.address.streetAddress(),
            //     address_line_two: `${state} ${postal_code}`,
            //     city: faker.address.city(),
            //     state,
            //     country: faker.address.country(),
            //     postal_code
            // },
        }, //{
            //     include: ["address", {
            //         model: Accounts,
            //         as: "account",
            //         include: "passwords"
            //     }]
            // },
            {
                include: ["passwords"]
            },
        );
        console.log("SEEDING COMPLETE");
    }
    catch (error) {
        console.log("ERROR IN DATA SEEDING", error);
    }
}
