/*
loadValidDomains.js

Setup dynamodb with the following valid domain addresses
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');
const jquerycsv = require('jquery-csv');
const fs = require('fs');

// talk directly to the database rather than docker routing.
config['dynamodb']['endpoint'] = config['dynamoPublicEndpoint'];

AWS.config.update(config.dynamodb);
const dynamoDb = new AWS.DynamoDB();

/**
 * load domain data
 * */
fs.readFile('./src/dynamodb/csvs/validDomains.csv', 'UTF-8', function(err, csv) {
  if (err) console.log(err);
  jquerycsv.toObjects(csv, {}, function(err, csvData) {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i<csvData.length; i++) {
      const params = {
        TableName: 'usersTable',
        Item: {
          'email': {S: csvData[i]['domain']},
          'usersId': {S: 'validDomains'},
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
