/*
deleteTables.js

Delete all tables in dynamodb instance found in config.js.
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');

// communicate directly with dynamo rather than docker routing
config['dynamodb']['endpoint'] = config['dynamoPublicEndpoint'];

AWS.config.update(config.dynamodb);
const dynamoDb = new AWS.DynamoDB();

/**
 * Delete tables in DynamoDB.
 * @param { string } tableJson filepath to table JSON delete rules.
 */
function deleteTable(tableJson) {
  dynamoDb.deleteTable(tableJson, function(err, data) {
    if (err) {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
  });
}

// delete all dynamo tables
deleteTable({
  TableName: require('./jsons/usersTable.json').TableName,
});
deleteTable({
  TableName: require('./jsons/eventsTable.json').TableName,
});
deleteTable({
  TableName: require('./jsons/transcriptsTable.json').TableName,
});
