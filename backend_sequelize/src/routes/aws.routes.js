const router = require('express').Router();
const awsController = require('../controllers/aws');

router.get('/getCustomer', awsController.processGetCustomer);

router.get('/getCustomer/:customerId', awsController.processGetOneCustomer);

router.post('/addCustomer', awsController.processAddCustomer);

router.put('/updateCustomer/:customerId', awsController.processUpdateCustomer);

router.delete('/deleteCustomer/:customerId', awsController.processDeleteCustomer);

module.exports = router;