const { Accounts } = require("../src/model_definitions/Accounts");
const { Passwords } = require("../src/model_definitions/Passwords");
const { CompanyParties, PartyItems } = require("../src/model_definitions/CompanyParties");

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

        // create super admin user
        const account = await Accounts.create({
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

        // Create 3 normal users
        for (let i = 0; i < 3; i ++) {
            let firstname = faker.name.firstName();
            let lastname = faker.name.lastName();
            let username = `${firstname}_${lastname}`.toLowerCase();
            
            await Accounts.create({
                firstname,
                lastname,
                username,
                email: `${username}@example.com`,
                passwords: [{
                    password: bcrypt.hashSync("12345678!", 10)
                }],
                admin_level: 0
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
        };

        // Create 1 interested party document
        const interestedPartiesList = ["Employees", "Customers", "Service Provider", "Government", "Stakeholders"];
        const interestedParties = await CompanyParties.create({
            title: `FY2021 Q2 Interested Parties`,
            created_by: account.account_id,
            approved_by: account.account_id,
            status: "active",
            approved_on: new Date()
        });

        const interestedPartiesInsertions = interestedPartiesList.map((party, i) => {
            return {
                fk_party_id: interestedParties.party_id,
                interested_party: party,
                expectations: faker.company.bs(),
                display_order: i + 1
            };
        });

        await PartyItems.bulkCreate(interestedPartiesInsertions);

        console.log("SEEDING COMPLETE");
    }
    catch (error) {
        console.log("ERROR IN DATA SEEDING", error);
    }
}
