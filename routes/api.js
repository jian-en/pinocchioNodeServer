/*
api.js

Routes for all apis, and show how to connect to DynamoBD as a
simple example.
*/

var express = require('express');
var router = express.Router();

const dynamoDb = require('../models/dynamoDbWrapper.js');

// validators
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
// jwt
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const env = process.env.NODE_ENV || 'local';
const jwtSecret = config[env].jwtSecret;

const { checkAuth } = require('../utils/auth.js');

// Add an event
router.post('/event', checkAuth, async (req, res, next) => {
  const { eventType, eventName } = req.body;

  const item = {
    eventsId: dynamoDb.generateID(),
    eventType: eventType,
    eventName: eventName
  };
  const result = await dynamoDb.putData('eventsTable', item);
  res.send(result);
});

// Get all events
router.get('/events', async (req, res, next) => {
  const result = await dynamoDb.scanData('eventsTable');
  res.send(result);
});

// register an account
router.post('/register', [
  check('email').isEmail().trim().normalizeEmail(),
  check('password').trim().isLength({min: 8}).isAlphanumeric(),
  check('firstname').trim().isLength({min: 1}),
  check('lastname').trim().isLength({min: 1}),
  check('phone').trim().isNumeric().isLength({min: 10, max: 10}),
  check('referral').trim()
], async (req, res, next) => {
  // check whether inputs are valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({success: false, errors: errors.array()});
  }

  // check whether the email has been used
  const existed = await dynamoDb.getUser(req.body.email);
  if (!existed.success) {
    return res.status(500).json(existed);
  } else if (existed.data.length > 0) {
    return res.status(200).json({success: false, message: "The email has been registered."});
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
  item.verificationSentAt = dynamoDb.getDateString(new Date);

  // put into database
  const result = await dynamoDb.putData('usersTable', item);
  if (!result.success) res.send(result);

  // TODO send verification email
  res.send(result);
});

router.post('/login', [
  check('email').isEmail().trim().normalizeEmail(),
  check('password').trim().isLength({min: 8}).isAlphanumeric(),
], async (req, res, next) => {
  // check whether inputs are valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({success: false, errors: errors.array()});
  }
  // get the user
  const { email, password } = req.body;
  const ret = await dynamoDb.getUser(email);
  if (!ret.success) return res.status(500).json(ret);
  else if (ret.data.length == 0) return res.json({success: false, message: "The email is incorrect."});
  // check password
  const user = ret.data[0];
  const hashedPwd = user.password;
  if (!bcrypt.compareSync(password, hashedPwd))
    return res.json({success: false, message: "The password is incorrect."});
  // issue token
  const payload = {usersId: user.usersId, email: user.email};
  const token = jwt.sign(payload, jwtSecret, {expiresIn: '2h'});
  res.json({success: true, token});
});

module.exports = router;
