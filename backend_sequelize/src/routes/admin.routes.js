const router = require('express').Router();
const accountsController = require('../controllers/accounts');

// MIDDLEWARES
const { isLoggedIn } = require('../middlewares/auth');
const { checkAccountStatus } = require('../middlewares/active');
const { onlySuperAdminAccess } = require('../middlewares/access');
const { errorHandler } = require('../middlewares/errorHandler');
const { errorLogger } = require('../middlewares/logging');

router.get(
    '/accounts',
    isLoggedIn,
    checkAccountStatus,
    onlySuperAdminAccess,
    accountsController.findAllAccounts,
    errorLogger,
    errorHandler
);

module.exports = router;
