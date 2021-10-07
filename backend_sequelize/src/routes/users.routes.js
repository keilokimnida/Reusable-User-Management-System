const router = require('express').Router();
const accountsController = require("../controllers/accounts");

// MIDDLEWARES
const { isLoggedIn } = require("../middlewares/login");
const { checkAccountStatus } = require("../middlewares/active");

// CREATE ACCOUNT
router.post("/account", accountsController.createAccount);

// 
router.get("/accounts", isLoggedIn, checkAccountStatus, accountsController.findAllAccounts);
router.get("/account/:accountID", isLoggedIn, checkAccountStatus, accountsController.findAccountByID);
router.put("/account/:accountID", isLoggedIn, checkAccountStatus, accountsController.editAccount);

module.exports = router;