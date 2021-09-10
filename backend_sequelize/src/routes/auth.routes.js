module.exports = router => {
    // LOGIN
    router.post("/login", authController.clientLogin);
    router.post("/admin/login", authController.adminLogin);
}