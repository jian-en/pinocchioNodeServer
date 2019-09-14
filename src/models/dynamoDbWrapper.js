/*
users.js

Model to communicate with database
*/

const config = require('../../config.js');
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update(config.dynamodb);
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.scanData = async (tableName, args) => {
  try {
    const params = {TableName: tableName, ...args};
    const data = await dynamoDb.scan(params).promise();
    return {success: true, data: data.Items};
  } catch (err) {
    console.error(err);
    return {success: false, ...err};
  }
};

module.exports.queryData = async (tableName, args) => {
  try {
    const params = {TableName: tableName, ...args};
    const data = await dynamoDb.query(params).promise();
    return {success: true, data: data.Items};
  } catch (err) {
    console.error(err);
    return {success: false, ...err};
  }
};

module.exports.putData = async (tableName, item) => {
  try {
    const params = {TableName: tableName, Item: item};
    await dynamoDb.put(params).promise();
    return {success: true};
  } catch (err) {
    console.error('error when putting data - ', item);
    console.error(err);
    return {success: false, ...err};
  }
};

module.exports.updateData = async (tableName, args) => {
  try {
    const params = {TableName: tableName, ...args};
    await dynamoDb.update(params).promise();
    return {success: true};
  } catch (err) {
    console.error('error when updating data - ', args);
    console.error(err);
    return {success: false, ...err};
  }
};

module.exports.deleteData = async (tableName, args) => {
  try {
    const params = {TableName: tableName, ...args};
    await dynamoDb.delete(params).promise();
    return {success: true};
  } catch (err) {
    console.error('error when deleting data - ', args);
    console.error(err);
    return {success: false, ...err};
  }
};

// generate unique ID based on UUID4
module.exports.generateID = () => {
  return uuidv4();
};

module.exports.getUserReferralCode = async (usersId) => {
  const args = {
    KeyConditionExpression: 'usersId = :usersid',
    ExpressionAttributeValues: {':usersid': usersId},
    ProjectionExpression: 'referralCode, referralToken',
  };
  return await this.queryData('usersTable', args);
};

// create referral code
module.exports.updateReferralCode = async (usersId, email, referralCode) => {
  const args = {
    Key: {usersId, email},
    UpdateExpression: 'set referralCode = :r',
    ExpressionAttributeValues: {
      ':r': referralCode,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  return await this.updateData('usersTable', args);
};

// create referral token
module.exports.updateReferralToken = async (usersId, email, referralToken) => {
  const args = {
    Key: {usersId, email},
    UpdateExpression: 'set referralToken = :r',
    ExpressionAttributeValues: {
      ':r': referralToken,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  return await this.updateData('usersTable', args);
};

module.exports.getUserEmails = async (email) => {
  const args = {
    IndexName: 'emailIndex',
    KeyConditionExpression: 'email= :e',
    ExpressionAttributeValues: {':e': email},
  };
  return await this.queryData('usersTable', args);
};

module.exports.getUser = async (usersId) => {
  const args = {
    KeyConditionExpression: 'usersId = :usersid',
    ExpressionAttributeValues: {':usersid': usersId},
    ProjectionExpression: 'email',
  };
  return await this.queryData('usersTable', args);
};

module.exports.getUserPublicKeys = async (publicKey) => {
  const args = {
    IndexName: 'publicKeyIndex',
    KeyConditionExpression: 'publicKey= :pk',
    ExpressionAttributeValues: {':pk': publicKey},
  };
  return await this.queryData('usersTable', args);
};

module.exports.getUserReferralCodes = async (referralCode) => {
  const args = {
    IndexName: 'referralCodeIndex',
    KeyConditionExpression: 'referralCode= :rc',
    ExpressionAttributeValues: {':rc': referralCode},
  };
  return await this.queryData('usersTable', args);
};

module.exports.getEventsOrganizer = async (organizerId) => {
  const args = {
    IndexName: 'organizerIdIndex',
    KeyConditionExpression: 'organizerId= :oid',
    ExpressionAttributeValues: {':oid': organizerId},
  };
  return await this.queryData('eventsTable', args);
};

module.exports.getEvents = async (eventsId) => {
  const args = {
    IndexName: 'eventsIdIndex',
    KeyConditionExpression: 'eventsId= :eid',
    ExpressionAttributeValues: {':eid': eventsId},
  };
  return await this.queryData('eventsTable', args);
};

module.exports.updateVerified = async (usersId, email, datetime) => {
  const args = {
    Key: {usersId, email},
    UpdateExpression: 'set verifiedAt = :d',
    ExpressionAttributeValues: {':d': datetime},
    ReturnValues: 'UPDATED_NEW',
  };
  return await this.updateData('usersTable', args);
};

module.exports.updateEvent = async (eventsId, organizerId, key, value) => {
  const args = {
    Key: {eventsId, organizerId},
    UpdateExpression: `set ${key} = :s`,
    ExpressionAttributeValues: {':s': value},
    ReturnValues: 'UPDATED_NEW',
  };
  return await this.updateData('eventsTable', args);
};

module.exports.getTranscripts = async () => {
  return await this.scanData('transcriptsTable', {});
};

module.exports.putTranscripts = async (jobName, eventsId, filename) => {
  const item = {
    transcriptJobName: jobName,
    eventsId: eventsId,
    filename: filename,
  };
  return await this.putData('transcriptsTable', item);
};

module.exports.deleteTranscripts = async (jobName) => {
  const args = {
    Key: {
      transcriptJobName: jobName,
    },
  };
  return await this.deleteData('transcriptsTable', args);
};
