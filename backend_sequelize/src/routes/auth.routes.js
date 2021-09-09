module.exports = router => {
    // LOGIN
    router.post("/api/v1/login", authController.clientLogin);
    router.post("/api/v1/admin/login", authController.adminLogin);
}