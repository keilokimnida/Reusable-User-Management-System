const router = require('express').Router();

const auth = require('./auth.routes');
const users = require('./users.routes');
const admin = require('./admin.routes');

const { errorHandler } = require('../middlewares/errorHandler');

router.get('/', (req, res) => {
    res.status(200).send('User Management System Backend');
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/admin', admin);

// we can have real central error handling if we mount this error handling middleware
// and call next(error) instead in our middlewares/controllers
router.use(errorHandler);

module.exports = router;
