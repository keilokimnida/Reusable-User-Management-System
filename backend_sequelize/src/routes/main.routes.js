module.exports = router => {
    router.get('/', function (req, res) {
        res.status(200).send('Welcome to User Management System');
    });

    // router.use('/admin', require('./admin.routes'));
    router.use('/auth', require('./auth.routes'));
    // router.use('/users', require('./users.routes'));
}