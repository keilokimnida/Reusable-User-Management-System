const authController = require("../controllers/auth");
const router = require('express').Router();

// LOGIN
router.post("/login", authController.clientLogin);
router.post("/admin/login", authController.adminLogin);



module.exports = router;