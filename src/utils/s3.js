/*
s3.js

Handles AWS S3 services
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');
const s3Config = config.awsConfig;
const protocol = config.awsS3.protocol;
const domain = config.awsS3.domain;
s3Config['endpoint'] = `${protocol}://${domain}`;
AWS.config.update(s3Config);
const s3 = new AWS.S3();

module.exports.s3Upload = async (filename, eventId, fileStream) => {
  const params = {
    Bucket: config.awsS3.uploadBucket,
    Body: fileStream,
    Key: `${eventId}-${filename}`,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        // upload successful
        console.log(data);
        return resolve(data);
      }
    });
  });
};
