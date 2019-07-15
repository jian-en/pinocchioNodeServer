/*
deleteTables.js

Delete all tables in dynamodb instance found in config.js.
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');

AWS.config.update(config.dynamodb);
const dynamoDb = new AWS.DynamoDB();

function deleteTable(table_json){
    dynamoDb.deleteTable(table_json, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

// delete all dynamo tables
deleteTable({
    TableName: require('./jsons/usersTable.json').TableName
});
deleteTable({
    TableName: require('./jsons/eventsTable.json').TableName
});
