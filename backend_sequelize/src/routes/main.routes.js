const router = require('express').Router();

const auth = require('./auth.routes');
const users = require('./users.routes');
const admin = require('./admin.routes');
const stripe = require('./stripe.routes');

const { accessLogger, errorLogger } = require('../middlewares/logging');
const { errorHandler } = require('../middlewares/errorHandler');

router.use(accessLogger);

router.get('/', (req, res, next) => {
    res.status(200).send('User Management System Backend');
});

// a route to cause an error, for tesing
router.get('/boom', (req, res, next) => {
    next(new Error('poo'));
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/admin', admin);
router.use(stripe);

router.use(errorLogger);

// we can have real central error handling if we mount this error handling middleware
// and call next(error) instead in our middlewares/controllers
router.use(errorHandler);

module.exports = router;
