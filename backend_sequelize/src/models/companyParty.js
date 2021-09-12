const { CompanyParties, PartyItems } = require("../model_definitions/CompanyParties");
const { Accounts } = require("../model_definitions/Accounts");

module.exports.findActivePartyDoc = async () => await CompanyParties.findOne({
    where: {
        status: "active"
    },
    include: [
        {
            model: Accounts,
            as: "author",
            attributes: ["username"]

        },
        {
            model: Accounts,
            as: "approver",
            attributes: ["username"]
        },
        "items"
    ],
    order: [[CompanyParties.associations.items, "display_order", "ASC"]]
});