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

function loadData(items){
    dynamoDb.batchWriteItem(items, function(err, data) {
        if (err) {
            console.error("Unable to load data. Error JSON: ", JSON.stringify(err, null, 2));
        } else {
            console.log("Successfully loaded data: ", JSON.stringify(data, null, 2));
        }
    });
}


fs.readFile('./src/tests/testData/csvs/userTestData.csv', 'UTF-8', function(err, csv){
    if(err) console.log(err);
    jquerycsv.toObjects(csv, {}, function (err, csvData) {
      if (err) { console.log(err); }
      for(var i = 0; i<csvData.length; i++){
        console.log(csvData[i]);
        var params = {
            TableName: 'usersTable',
            Item: {
                'firstname': {S: csvData[i]['firstname']},
                'password': {S: csvData[i]['password']},
                'phone': {S: csvData[i]['phone']},
                'usersId': {S: csvData[i]['usersId']},
                'verificationSentAt': {S: csvData[i]['verificationSentAt']},
                'email': {S: csvData[i]['email']},
                'lastname': {S: csvData[i]['lastname']}
            }
        }
        if(csvData[i]['verifiedAt']){
            params.Item.verifiedAt = {S: csvData[i]['verifiedAt']}
        }

        dynamoDb.putItem(params, function(err, data) {
            if (err) {
              console.log("Error putting item in db", err);
            } else {
              console.log("Success in inserting user data", data);
            }
          });
      }      
    });
});


// load all dynamo test data
// loadData(require('./jsons/usersTestData.json'));
// loadData(require('./jsons/eventsTestData.json'));
