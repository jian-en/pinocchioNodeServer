const AWS = require('aws-sdk');
const region = 'us-east-1';
const client = new AWS.SecretsManager({region: region});

module.exports.getKey = async (secretName) => {
  try {
    const data = await client.getSecretValue({SecretId: secretName}).promise();
    return JSON.parse(data.SecretString);
  } catch (e) {
    return null;
  }
};
