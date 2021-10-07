const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send('User Management System Backend');
});

router.use('/api/v1/auth', require('./auth.routes'));
router.use('/api/v1/users', require('./users.routes'));
router.use('/api/v1/admin', require('./admin.routes'));
router.use('/api/v1/documents', require('./companyParties.routes'));

module.exports = router;
