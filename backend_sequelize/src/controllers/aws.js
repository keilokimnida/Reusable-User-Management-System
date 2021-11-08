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
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};

//GET ONE CUSTOMER
module.exports.processGetOneCustomer = async (req, res, next) => {
    const id = req.params.customerId;
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
        //{customerId: id} something like this
        Item: items
    };

    try {
        let characters = await dynamoClient.put(params).promise();
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};

//DELETE CUSTOMER
module.exports.processDeleteCustomer = async (req, res, next) => {
    const id = req.params.customerId;

    const params = {
        TableName: TABLE_NAME,
        Key: {
            "customerId": id,
            //THIS SHOULD NOT BE HARD CODED, BUT DUE TO THE SAMPLE
            //DATABASE DESIGN I HAVE TO IMPLEMENT IT LIKE THIS
            "date": "2019"
        },
        ConditionExpression:"customerId = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    };
    console.log(params)
    try {
        let characters = await dynamoClient.delete(params).promise();
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};