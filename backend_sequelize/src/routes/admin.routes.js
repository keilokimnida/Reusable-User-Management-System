const router = require('express').Router();
const accountsController = require('../controllers/accounts');

// MIDDLEWARES
const { isLoggedIn } = require("../middlewares/login");
const { checkAccountStatus } = require("../middlewares/active");
const { onlyAdminAccess } = require('../middlewares/access');

router.get("/accounts", isLoggedIn, checkAccountStatus, onlyAdminAccess, accountsController.findAllAccounts);

module.exports = router;