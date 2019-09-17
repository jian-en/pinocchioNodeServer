/*
controller for transcripts
*/

const dynamoDb = require('../models/dynamoDbWrapper.js');
const transcribe = require('../utils/transcription.js');

const responseMsg = require('../utils/responseMsg');
const errorMsg = require('../utils/errorMsg');
const {transcriptionStatuses} = require('../utils/constants');
const {sendTranscriptCompleteEmail} = require('./emailHelper');

// This endpoint is meant to be hit by a cron job to determine
// if the pending transcripts are finished. If they are finished,
// an email notification will be sent to the organizer and the eventsTable
// transcription status will be updated.
exports.update = async (req, res, next) => {
  // get currently pending transcripts
  const pendingTranscripts = await dynamoDb.getTranscripts();
  if (!pendingTranscripts.success) return res.status(500).json(pendingTranscripts);
  else {
    if (pendingTranscripts.data.length > 0) {
      // completedTranscripts will store all the
      // transcripts associated with an eventId.
      // This is to only do one query to update all
      // the transcripts in a single eventId in the
      // eventsTable.
      const completedTranscripts = {};
      for (transcripts of pendingTranscripts.data) {
        const transcriptJobName = transcripts.transcriptJobName;
        const eventsId = transcripts.eventsId;
        const filename = transcripts.filename;
        await transcribe.getTranscriptionJob(transcriptJobName)
            .then((transcriptInfo) => {
            // successfully got transcription job
              const transcriptStatus = transcriptInfo['TranscriptionJobStatus'];
              if (transcriptStatus == transcriptionStatuses.COMPLETED) {
                const tmp = {
                  filename: filename,
                  transcriptDetails: transcriptInfo,
                };
                // transcript is completed
                if (eventsId in completedTranscripts) {
                  completedTranscripts[eventsId].push(tmp);
                } else {
                  completedTranscripts[eventsId] = [tmp];
                }
                // delete from transcriptsTable
                dynamoDb.deleteTranscripts(transcriptJobName);
              }
            })
            .catch((err) => {
              // transcription service error
              return res.status(500).json(responseMsg.error(errorMsg.params.TRANSCRIBESERVICE,
                  errorMsg.messages.AWS_SERVICE_ERROR));
            });
      }
      // update transcripts in eventsTable
      if (completedTranscripts.length != 0) {
        for (const eventsId in completedTranscripts) {
          if (completedTranscripts.hasOwnProperty(eventsId)) {
            const eventDetails = await dynamoDb.getEvents(eventsId);
            if (!eventDetails.success) return res.status(500).json(eventDetails);
            else {
              // original event transcripts
              const eventTranscripts = eventDetails.data[0].transcripts;
              const organizerId = eventDetails.data[0].organizerId;

              // get organizer email
              const userExists = await dynamoDb.getUser(organizerId);
              let organizerEmail= '';
              if (!userExists.success) return res.status(500).json(userExists);
              if (userExists.data.length > 0) {
                // user exists
                organizerEmail = userExists.data[0].email;
              }

              // recently updated transcripts
              const completedEventTranscripts = completedTranscripts[eventsId];

              // iterate through updated status transcripts
              for (eventTranscript of completedEventTranscripts) {
                const filename = eventTranscript.filename;
                if (filename in eventTranscripts) {
                  // replace pending transcript info with new info
                  eventTranscripts[filename] = eventTranscript.transcriptDetails;

                  // send email notification
                  sendTranscriptCompleteEmail(organizerEmail, filename);
                }
              }
              // update the eventId completed transcripts
              dynamoDb.updateEvent(eventsId, organizerId, 'transcripts', eventTranscripts);
            }
          }
        }
      }
    }
    return res.json(responseMsg.success({}));
  }
};
