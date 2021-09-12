const router = require('express').Router();
const accountsController = require("../controllers/accounts");

// MIDDLEWARES
const { isLoggedIn } = require("../middlewares/login");

// NORMAL USER
router.get("/accounts", isLoggedIn, (req, res) => accountsController.findAllAccounts(req, res, false));
router.get("/account/:accountID", isLoggedIn, (req, res) => accountsController.findAccountByID(req, res, false));
router.put("/account/:accountID", isLoggedIn, accountsController.editAccount);

module.exports = router;