const AWS = require('aws-sdk');

const r = require('../utils/response').responses;
const E = require('../errors/Errors');

const config = require('../config/config.js');

AWS.config.update({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Customer";

//GET CUSTOMER
module.exports.processGetCustomer = async (req, res, next) => {
    const params = {
        TableName: TABLE_NAME
    };

    try {
        let characters = await dynamoClient.scan(params).promise();
        console.log(characters)
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};

//ADD CUSTOMER
module.exports.processAddCustomer = async (req, res, next) => {
    const items = req.body;
    console.log("processAddCustomer is Running.");
    console.log(items);
    const params = {
        TableName: TABLE_NAME,
        Item: items
    };

    try {
        let characters = await dynamoClient.put(params).promise();
        console.log(characters)
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};