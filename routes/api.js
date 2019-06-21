/*
api.js

Routes for all apis, and show how to connect to DynamoBD as a
simple example.
*/

var express = require('express');
var router = express.Router();

const AWS = require('aws-sdk');
const config = require('../config.js');
const env = process.env.NODE_ENV || 'local';
AWS.config.update(config[env]);
var dynamoDb = new AWS.DynamoDB.DocumentClient();

// Add an event
router.post('/event', (req, res, next) => {
  const { eventType, eventName} = req.body;
  const params = {
    TableName: config.aws_table_name,
    Item: {
      eventsId: (Math.random().toString()),
      eventType: eventType,
      eventName: eventName
    }
  };

  dynamoDb.put(params, (err, data) => {
    if (err) {
      console.error(err);
      res.send({success: false, message: 'Server Error'});
    } else {
      res.send({success: true, message: data.Items});
    }
  });
});

// Get all events
router.get('/events', (req, res, next) => {
  const params = {
    TableName: config.aws_table_name
  };
  dynamoDb.scan(params, (err, data) => {
    if (err) {
      res.send({success: false, message: 'Server Error'});
    } else {
      res.send({success: true, message: data});
    }
  });
});

module.exports = router;
