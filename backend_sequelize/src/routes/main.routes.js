module.exports = router => {
    router.get('/', function (req, res) {
        res.status(200).send('Welcome to User Management System');
    });

    // router.use('/api/v1/admin', require('./admin.routes'));
    router.use('/api/v1/auth', require('./auth.routes'));
    // router.use('/api/v1/users', require('./users.routes'));
}