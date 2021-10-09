const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send('User Management System Backend');
});

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/documents', require('./companyParties.routes'));

module.exports = router;
