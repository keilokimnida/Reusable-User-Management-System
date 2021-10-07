const router = require('express').Router();
const authController = require('../controllers/auth');

// LOGIN
router.post('/login', authController.clientLogin);
router.post('/admin/login', authController.adminLogin);

module.exports = router;
