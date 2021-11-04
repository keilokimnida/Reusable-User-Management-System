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
        //{customerId: id} something like this
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

//UPDATE CUSTOMER
//UPDATE CUSTOMER IS ALSO NOT WORKING
//SOMEONE END ME PLEASE WHY IS ALL THE GUIDES WRONG
module.exports.processUpdateCustomer = async (req, res, next) => {
    const id = req.params.customerId;
    const name = req.body.name;

    const params = {
        TableName: TABLE_NAME,
        //WHY ISNT THIS FUCKING KEY WORKING AND I HAVE NO IDEA WHAT IM PUTTING IN THE EXPRESSION
        Key: { "customerId": id},
        UpdateExpression: 'set #name = :name',
        ConditionExpression: '#name = :name',
        ExpressionAttributeNames: { '#name': name },
        ExpressionAttributeValues: {
            ':name': JSON.stringify(name)
        }
    };
    console.log(params)
    try {
        let characters = await dynamoClient.update(params).promise();
        console.log(characters)
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};

//DELETE CUSTOMER
//DELETE IS CURRENTLY NOT WORKING I WILL FIX IT ANOTHER TIME
module.exports.processDeleteCustomer = async (req, res, next) => {
    const id = req.params.customerId;

    const params = {
        TableName: TABLE_NAME,
        //STUPID FUCKING KEY
        Key: {
            "customerId": id,
            "date": "2020"
        },
        ConditionExpression:"customerId = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    };
    console.log(params)
    try {
        let characters = await dynamoClient.delete(params).promise();
        console.log(characters)
        return res.status(200).send(characters);

    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).send({
            message: error
        });
    }

};