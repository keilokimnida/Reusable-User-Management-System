const router = require('express').Router();
const accountsController = require('../controllers/accounts');

// MIDDLEWARES
const { isLoggedIn } = require('../middlewares/auth');
const { findAccountID } = require('../middlewares/access');
const { checkAccountStatus } = require('../middlewares/active');

// CREATE ACCOUNT
router.post(
    '/account',
    accountsController.createAccount
);

router.get(
    '/account/:accountID',
    isLoggedIn,
    // findAccountID,
    checkAccountStatus,
    accountsController.findAccountByID
);

router.put(
    '/account/:accountID',
    isLoggedIn,
    // findAccountID,
    checkAccountStatus,
    accountsController.editAccount
);

module.exports = router;
