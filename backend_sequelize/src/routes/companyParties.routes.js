const router = require('express').Router();
const partyController = require("../controllers/companyParty");

// MIDDLEWARES
const { isLoggedIn } = require("../middlewares/login");
const { checkAccountStatus } = require("../middlewares/active");

// INTERESTED PARTIES DOCUMENTS
router.get("/interested-party/active", isLoggedIn, checkAccountStatus, partyController.findActiveInterestedParties);

module.exports = router;