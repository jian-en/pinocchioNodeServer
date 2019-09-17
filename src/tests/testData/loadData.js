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
 * Loads test data into dynamoDB
 * @param {string} filepath to CSV test data
 * @param {string} tableName what table to insert to in dynamodb
 */
function loadTestData(filepath, tableName) {
  fs.readFile(filepath, 'UTF-8', function(err, csv) {
    if (err) console.log(err);
    jquerycsv.toObjects(csv, {}, function(err, csvData) {
      if (err) {
        console.log(err);
      }
      for (let i = 0; i<csvData.length; i++) {
        const params = {
          TableName: tableName,
          Item: {},
        };

        for (const key in csvData[i]) {
          if (csvData[i][key] === '') continue;
          if (csvData[i][key] == '{}') params.Item[key] = {M: {}};
          else params.Item[key] = {S: csvData[i][key]};
        }

        dynamoDb.putItem(params, function(err, data) {
          if (err) {
            console.log(`Error putting item in ${tableName}`, err);
          } else {
            console.log(`Success in inserting ${tableName} data`, data);
          }
        });
      }
    });
  });
}

loadTestData('./src/tests/testData/csvs/userTestData.csv', 'usersTable');
loadTestData('./src/tests/testData/csvs/eventTestData.csv', 'eventsTable');
