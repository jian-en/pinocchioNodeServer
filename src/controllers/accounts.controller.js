/*
controller for accounts
*/

const dynamoDb = require('../models/dynamoDbWrapper.js');

// validators
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
// jwt
const auth = require('../utils/auth.js');
const { sendMail } = require('../utils/mailer');

const datetime = require('../utils/datetime');
const { reactServer } = require('../../config.js');

// validate POST body contents
exports.validate = (method) => {
    switch(method) {
        case 'register': {
            return [
                check('email').isEmail().trim().normalizeEmail(),
                check('password').trim().isLength({min: 8}).isAlphanumeric(),
                check('firstname').trim().isLength({min: 1}),
                check('lastname').trim().isLength({min: 1}),
                check('phone').trim().isNumeric().isLength({min: 10, max: 10}),
                check('referral').trim()
            ]
        }
    }
}

// create a new account
exports.register = async (req, res, next) => {
    // check whether inputs are valid
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      const msgs = validation.errors.map(err => `The ${err.param} has incorrect format.`)
      return res.status(422).json({success: false, errors: msgs});
    }
  
    // check whether the email has been used
    const { email } = req.body;
    const existed = await dynamoDb.getUser(email);
    if (!existed.success) {
      return res.status(500).json(existed);
    } else if (existed.data.length > 0) {
      return res.status(422).json({success: false, errors: ["The email has been registered."]});
    }
  
    // build item
    const item = {};
    for (var key in req.body) {
      if (key === 'referral') continue; //TODO update when referral code has been defined
      // hash the password
      item[key] = req.body[key];
      if (key === 'password') {
        item[key] = bcrypt.hashSync(req.body[key], salt);
      }
    }
    item.usersId = dynamoDb.generateID();
    item.verificationSentAt = datetime.getDatetimeString();
  
    // put into database
    const result = await dynamoDb.putData('usersTable', item);
    if (!result.success) return res.status(500).send(result);
  
    const payload = {email, sentAt: datetime.getUnixTimestamp()};
    const token = auth.generateToken(payload, '30d');
    const url = `${reactServer}/activate-account?token=${token}`
    sendMail(
      req.body.email,
      'Pinocchio - Verification Email',
      `Click the link to verify your account: ${url}`
    )
    res.send(result);
};

// activate a newly created account
exports.activate = (req, res) => {
    res.send("Hello World!\n");
};

// log into an account
exports.login = (req, res) => {
    res.send("Hello World!\n");
};

// get user based on token
exports.getUser = (req, res) => {
    res.send("Hello World!\n");
};
