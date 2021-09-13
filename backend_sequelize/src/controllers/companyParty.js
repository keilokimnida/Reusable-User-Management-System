const { CompanyParties, PartyItems } = require("../model_definitions/CompanyParties");
const { findActivePartyDoc } = require("../models/CompanyParty");

const { responses: r } = require("../utils/response");

// ============================================================

// READ

// ============================================================

module.exports.findActiveInterestedParties = async (req, res) => {
    try {
        // decoded JWT token
        const { auth: { decoded } } = res.locals;

        const active = await findActivePartyDoc();

        if (!active) return res.status(204).send();

        return res.status(200).send(active);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send();
    }
}