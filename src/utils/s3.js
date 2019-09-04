/*
s3.js

Handles AWS S3 services
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');
const s3Config = config.awsConfig;
s3Config['endpoint'] = config.awsS3.endpoint;
console.log(s3Config);
AWS.config.update(s3Config);
const s3 = new AWS.S3();


module.exports.s3Upload = async (filename, eventId, fileStream) => {
  console.log('s3 upload');
  const params = {
    Bucket: config.awsS3.uploadBucket,
    Body: fileStream,
    Key: `${eventId}-${filename}`,
  };
  s3.upload(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};
