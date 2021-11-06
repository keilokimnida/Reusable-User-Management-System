const router = require('express').Router();
const accountsController = require('../controllers/accounts');

// MIDDLEWARES
const { isLoggedIn } = require('../middlewares/auth');
const { checkAccountStatus } = require('../middlewares/active');

// CREATE ACCOUNT
router.post(
    '/account',
    accountsController.createAccount
);

router.get(
    '/account/:accountUUID',
    isLoggedIn,
    // findAccountID,
    checkAccountStatus,
    accountsController.findAccountByID
);

router.put(
    '/account/:accountUUID',
    isLoggedIn,
    // findAccountID,
    checkAccountStatus,
    accountsController.editAccount
);

module.exports = router;
