/*
loadData.js

Loads test data (based on jsons) in dynamodb instance found in config.js.
*/

const config = require('../../../config.js');
const AWS = require('aws-sdk');
const jquerycsv = require('jquery-csv');
const fs = require('fs');

// talk directly to the database rather than docker routing.
config['dynamodb']['endpoint'] = config['dynamoPublicEndpoint'];

AWS.config.update(config.dynamodb);
const dynamoDb = new AWS.DynamoDB();

/**
 * load user data; this is done by CSV for easier testing/future data manipulation 
 * */ 
fs.readFile('./src/tests/testData/csvs/userTestData.csv', 'UTF-8', function(err, csv) {
  if (err) console.log(err);
  jquerycsv.toObjects(csv, {}, function(err, csvData) {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i<csvData.length; i++) {
      const params = {
        TableName: 'usersTable',
        Item: {
          'firstname': {S: csvData[i]['firstname']},
          'password': {S: csvData[i]['password']},
          'phone': {S: csvData[i]['phone']},
          'usersId': {S: csvData[i]['usersId']},
          'verificationSentAt': {S: csvData[i]['verificationSentAt']},
          'email': {S: csvData[i]['email']},
          'lastname': {S: csvData[i]['lastname']},
        },
      };
      if (csvData[i]['verifiedAt']) {
        params.Item.verifiedAt = {S: csvData[i]['verifiedAt']};
      }

      dynamoDb.putItem(params, function(err, data) {
        if (err) {
          console.log('Error putting item in db', err);
        } else {
          console.log('Success in inserting user data', data);
        }
      });
    }
  });
});

/**
 * load events data
 *  */
fs.readFile('./src/tests/testData/csvs/eventTestData.csv', 'UTF-8', function(err, csv) {
  if (err) console.log(err);
  jquerycsv.toObjects(csv, {}, function(err, csvData) {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i<csvData.length; i++) {
      const params = {
        TableName: 'eventsTable',
        Item: {
          'name': {S: csvData[i]['name']},
          'eventsId': {S: csvData[i]['eventsId']},
          'organizerId': {S: csvData[i]['organizerId']},
          'attendees': {S: csvData[i]['attendees']},
          'type': {S: csvData[i]['type']},
          'address': {S: csvData[i]['address']},
          'city': {S: csvData[i]['city']},
          'zipcode': {S: csvData[i]['zipcode']},
          'state': {S: csvData[i]['state']},
          'promotionUrl': {S: csvData[i]['promotionUrl']},
          'status': {S: csvData[i]['status']},
        },
      };

      dynamoDb.putItem(params, function(err, data) {
        if (err) {
          console.log('Error putting item in db', err);
        } else {
          console.log('Success in inserting user data', data);
        }
      });
    }
  });
});
