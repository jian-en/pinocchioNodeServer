/*
transription.js

Handles AWS transcribe start transcription services
*/

const config = require('../../config.js');
const AWS = require('aws-sdk');
AWS.config.update(config.awsTranscribeConfig);
const transcribeService = new AWS.TranscribeService();


module.exports.startTranscription = async (mediaFileLoaction) => {
  console.log('transcription started');
  const filename = mediaFileLoaction.split('/').pop();
  const transcribeConfig = config.awsTranscriptionJob;
  transcribeConfig['Media']['MediaFileUri'] = mediaFileLoaction;
  transcribeConfig['TranscriptionJobName'] = filename;

  transcribeService.startTranscriptionJob(transcribeConfig, function(err, data) {
    // TODO: Add error/success responses
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};
