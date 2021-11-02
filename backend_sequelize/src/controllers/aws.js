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

module.exports.processGetOneCustomer = async (req, res, next) => {
    const id = req.params.customerId
    console.log(id);
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
            ":customerId": id
        }
    };

    try {
        let characters = await dynamoClient.query(params).promise();
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
        //Key in data in the new JSON Dynamo format
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