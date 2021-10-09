const router = require('express').Router();
const authController = require('../controllers/auth');
const passwordController = require('../controllers/passwords');

const { isLoggedIn } = require('../middlewares/login');

// LOGIN
router.post('/login', authController.clientLogin);
router.post('/admin/login', authController.adminLogin);

// FORGOT PASSWORD
router.post('/forgot-password/request', passwordController.forgotPassword);
router.post('/forgot-password/change', passwordController.changeForgottenPassword);

// CHANGE PASSWORD WHILE LOGGED IN
router.post('/password/change', isLoggedIn, passwordController.changeLoggedInPassword);

module.exports = router;
