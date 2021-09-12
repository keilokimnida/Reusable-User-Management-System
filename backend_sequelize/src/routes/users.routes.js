const router = require('express').Router();
const accountsController = require("../controllers/accounts");

// MIDDLEWARES
const { isLoggedIn } = require("../middlewares/login");

// NORMAL USER
router.get("/account", isLoggedIn, accountsController.findAllAccounts);
router.get("/account/:accountID", isLoggedIn, accountsController.findAccountByID);
router.put("/account", isLoggedIn, accountsController.editAccount);

module.exports = router;