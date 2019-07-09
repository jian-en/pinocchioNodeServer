/*
users.js

Model to communicate with database
*/

const AWS = require('aws-sdk');
const config = require('../config.js');
const env = process.env.NODE_ENV || 'local';
AWS.config.update(config[env]);
var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.scanData = async (tableName) => {
  try {
    const params = {TableName: tableName};
    const data = await dynamoDb.scan(params).promise();
    return {success: true, data: data.Items};
  } catch(err) {
    console.error(err);
    return {success: false, ...err}
  }
};

module.exports.queryData = async (tableName, args) => {
  try {
    const params = {TableName: tableName, ...args};
    const data = await dynamoDb.query(params).promise();
    return {success: true, data: data.Items};
  } catch(err) {
    console.error(err);
    return {success: false, ...err}
  }
};

module.exports.putData = async (tableName, item) => {
  try {
    const params = {TableName: tableName, Item: item};
    await dynamoDb.put(params).promise();
    return {success: true};
  } catch(err) {
    console.error("error when putting data - ", item);
    console.error(err);
    return {success: false, ...err}
  }
}

// TODO ID should be unique ...
module.exports.generateID = () => {
  return Math.random().toString();
};

module.exports.getUser = async (email) => {
  const args = {
    IndexName: 'emailIndex',
    KeyConditionExpression: 'email= :e',
    ExpressionAttributeValues: {":e": email}
  };
  return await this.queryData('usersTable', args);
};


////// HELPERS
module.exports.getDateString = (dateObj) => {
  return dateObj.toISOString();
};

module.exports.getDateObj = (dateStr) => {
  return new Date(dateStr);
};
