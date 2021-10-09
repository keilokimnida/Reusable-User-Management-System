const { CompanyParties, PartyItems } = require('../schemas/CompanyParties');
const { findActivePartyDoc } = require('../models/CompanyParty');

const { responses: r } = require('../utils/response');
const E = require('../errors/Errors');

// ============================================================

// READ

// ============================================================

module.exports.findActiveInterestedParties = async (req, res) => {
    try {
        // decoded JWT token
        const {
            auth: { decoded }
        } = res.locals;

        const active = await findActivePartyDoc();

        if (!active) return res.status(204).send();

        return res.status(200).send(active);
    }
    catch (error) {
        // custom errors
        if (error instanceof E.BaseError) res.status(error.code).send(error.toJSON());
        // other errors
        else {
            console.log(error);
            res.status(500).send(r.error500(error));
        }
    }
};
