const { mailAuth } = require('../config.js');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailAuth.user,
    pass: mailAuth.password
  }
});

module.exports.sendMail = (receiver, title, content) => {
  const options = {
    from: mailAuth.user,
    to: receiver,
    subject: title,
    text: content
  }
  transporter.sendMail(options, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent to ' + receiver + ': ' + info.response);
    }
  });
};
