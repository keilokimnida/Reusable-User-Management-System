const authController = require("../controllers/auth");
const router = require('express').Router();

// LOGIN
router.post("/login", authController.clientLogin);
router.post("/admin/login", authController.adminLogin);

// VERIFY CREATE ACCOUNT
router.post("/verify-create-account/:token", authController.verifyCreateAccount);

module.exports = router;