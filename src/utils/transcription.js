/*
transription.js

Handles AWS transcribe start transcription services
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');
const transcribeConfig = config.awsConfig;
transcribeConfig['endpoint'] = config.awsTranscribeConfig.endpoint;
AWS.config.update(transcribeConfig);
const transcribeService = new AWS.TranscribeService();

module.exports.startTranscription = async (mediaFileLoaction) => {
  const filename = mediaFileLoaction.split('/').pop();
  const transcribeConfig = config.awsTranscriptionJob;
  transcribeConfig['Media']['MediaFileUri'] = mediaFileLoaction;
  transcribeConfig['TranscriptionJobName'] = filename;

  return new Promise((resolve, reject) => {
    transcribeService.startTranscriptionJob(transcribeConfig, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        console.log(data);
        return resolve(data);
      }
    });
  });
};
