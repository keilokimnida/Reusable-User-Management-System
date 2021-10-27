const router = require('express').Router();
const awsController = require('../controllers/aws');

router.get('/getCustomer', awsController.processGetCustomer);

router.post('/addCustomer', awsController.processAddCustomer);

module.exports = router;