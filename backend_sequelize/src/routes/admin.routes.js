const router = require('express').Router();
const accountsController = require('../controllers/accounts');

// MIDDLEWARES
const { isLoggedIn } = require('../middlewares/auth');
const { checkAccountStatus } = require('../middlewares/active');
const { onlySuperAdminAccess } = require('../middlewares/access');

router.get(
    '/accounts',
    isLoggedIn,
    checkAccountStatus,
    onlySuperAdminAccess,
    accountsController.findAllAccounts
);

module.exports = router;
