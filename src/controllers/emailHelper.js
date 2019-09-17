/**
 * Helper file to send emails
 */

const {sendMail} = require('../utils/mailer');
const auth = require('../utils/auth.js');
const datetime = require('../utils/datetime');
const {reactServer} = require('../../config.js');
const {eventMessage} = require('../utils/constants.js');

module.exports.sendVerificationEmail = (email) => {
  const payload = {email, sentAt: datetime.getUnixTimestamp()};
  const token = auth.generateToken(payload, '30d');
  const url = `${reactServer}/activate-account?token=${token}`;
  sendMail(
      email,
      'Pinocchio - Verification Email',
      `Click the link to verify your account: ${url}`
  );
};

module.exports.sendEventStatusEmail = (email, name, status) => {
  sendMail(
      email,
      `Pinocchio - Your event is ${status}`,
      `Your event, ${name}, status:
       \n ${eventMessage[status]}
       \n Best,\nPinocchio`
  );
};

module.exports.sendTranscriptCompleteEmail = (email, filename) => {
  sendMail(
      email,
      `Pinocchio - Your transcript for ${filename} is ready!`,
      `Please log into Pinocchio to view your transcript online!
       \n Best,\nPinocchio`
  );
};
