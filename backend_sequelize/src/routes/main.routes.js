const router = require('express').Router();

const auth = require('./auth.routes');
const users = require('./users.routes');
const admin = require('./admin.routes');
const interestedParties = require('./companyParties.routes');

const { BaseError } = require('../errors/Errors');
const { error500 } = require('../utils/response').responses;

router.get('/', (req, res) => {
    res.status(200).send('User Management System Backend');
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/admin', admin);
router.use('/documents', interestedParties);

// we can have real central error handling if we mount this error handling middleware
// and call next(error) instead in our middlewares/controllers
router.use((error, req, res, next) => {
    // check if there was already a response
    if (res.headersSent) return;

    // custom errors
    if (error instanceof BaseError)
        return res.status(error.code).send(error.toJSON());

    // other errors
    console.log(error);
    return res.status(500).send(error500(error));
});

module.exports = router;
