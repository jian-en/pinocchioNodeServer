/*
controller for accounts
*/

const dynamoDb = require('../models/dynamoDbWrapper.js');

// validators
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
// jwt
const auth = require('../utils/auth.js');
const {sendMail} = require('../utils/mailer');

const datetime = require('../utils/datetime');
const {reactServer} = require('../../config.js');
const responseMsg = require('../utils/responseMsg');
const errorMsg = require('../utils/errorMsg');

// validate POST body contents
exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        check('email').isEmail().trim().normalizeEmail(),
        check('password').trim().isLength({min: 8}).isAlphanumeric(),
        check('firstname').trim().isLength({min: 1}),
        check('lastname').trim().isLength({min: 1}),
        check('phone').trim().isNumeric().isLength({min: 10, max: 10}),
        check('referral').trim(),
        // TODO: check if public key is valid ETH key
        check('publicKey').trim().isLength({min: 1}),
      ];
    }
    case 'login': {
      return [
        check('email').isEmail().trim().normalizeEmail(),
        check('password').trim().isLength({min: 8}).isAlphanumeric(),
      ];
    }
  }
};

// create a new account
exports.register = async (req, res, next) => {
  // check whether inputs are valid
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(responseMsg.validationError422(validation.errors));
  }

  const {email} = req.body;

  // build item
  const item = {};
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      switch (key) {
        case 'email':
          // check whether the email has been used
          const emailExists = await dynamoDb.getUserEmails(email);
          if (!emailExists.success) {
            return res.status(500).json(emailExists);
          } else if (emailExists.data.length > 0) {
            return res.status(422).json(responseMsg.error(errorMsg.params.EMAIL,
                errorMsg.messages.EMAIL_REGISTERED));
          }
          // check if the domain is valid
          const validDomains = await dynamoDb.getValidDomains();
          const requestDomain = email.split('@').pop();
          if (!validDomains.success) {
            return res.status(500).json(validDomains);
          } else if (!validDomains.data.some((e) => e.email == requestDomain)) {
            return res.status(422).json(responseMsg.error(errorMsg.params.Email,
                errorMsg.messages.EMAIL_INVALID_DOMAIN));
          }

          item[key] = req.body[key];
          break;
        case 'password':
          item[key] = bcrypt.hashSync(req.body[key], salt);
          break;
        case 'publicKey':
          // check whether the publicKey has been used
          const publicKeyExists = await dynamoDb.getUserPublicKeys(req.body[key]);
          if (!publicKeyExists.success) {
            return res.status(500).json(publicKeyExists);
          } else if (publicKeyExists.data.length > 0) {
            return res.status(422).json(responseMsg.error(errorMsg.params.PUBLICKEY,
                errorMsg.messages.PUBLICKEY_REGISTERED));
          }
          item[key] = req.body[key];
          break;
        case 'referral':
          continue; // TODO update when referral code has been defined
        default:
          item[key] = req.body[key];
      }
    }
  }
  item.usersId = dynamoDb.generateID();
  item.verificationSentAt = datetime.getDatetimeString();

  // put into database
  const result = await dynamoDb.putData('usersTable', item);
  if (!result.success) return res.status(500).send(result);

  const payload = {email, sentAt: datetime.getUnixTimestamp()};
  const token = auth.generateToken(payload, '30d');
  const url = `${reactServer}/activate-account?token=${token}`;
  sendMail(
      req.body.email,
      'Pinocchio - Verification Email',
      `Click the link to verify your account: ${url}`
  );
  res.send(result);
};

// activate a newly created account
exports.activate = async (req, res, next) => {
  const {token} = req.body;
  const decoded = auth.decodeToken(token);
  if (!decoded) {
    return res.status(422).json(responseMsg.error(errorMsg.params.TOKEN,
        errorMsg.messages.TOKEN_INVALID));
  }
  const {email, sentAt} = decoded;
  // check whether token is valid in 7 days
  if (!datetime.inTime(sentAt, {days: 7})) {
    return res.status(422).json(responseMsg.error(errorMsg.params.TOKEN,
        errorMsg.messages.TOKEN_EXPIRED));
  }
  // check whether the email exists
  let ret = await dynamoDb.getUserEmails(email);
  if (!ret.success) {
    return res.status(500).json(ret);
  } else if (ret.data.length == 0) {
    return res.status(422).json(responseMsg.error(errorMsg.params.EMAIL,
        errorMsg.messages.EMAIL_INVALID));
  }

  const user = ret.data[0];
  // make sure the account hasn't activated
  if (user.verifiedAt) {
    return res.status(422).json(responseMsg.error(errorMsg.params.TOKEN,
        errorMsg.messages.ACCOUNT_VERIFIED));
  }
  // update the user as verified
  ret = await dynamoDb.updateVerified(user.usersId, email, datetime.getDatetimeString());
  if (!ret.success) return res.status(500).json(ret);
  res.json(responseMsg.success({}));
};

// log into an account
exports.login = async (req, res, next) => {
  // check whether inputs are valid
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(responseMsg.validationError422(validation.errors));
  }
  // get the user
  const {email, password} = req.body;
  const ret = await dynamoDb.getUserEmails(email);
  if (!ret.success) {
    return res.status(500).json(ret);
  } else if (ret.data.length == 0) {
    return res.status(422).json(responseMsg.error(errorMsg.params.EMAIL,
        errorMsg.messages.EMAIL_NOT_REGISTERED));
  }

  const user = ret.data[0];
  // check verified
  if (!user.verifiedAt) {
    return res.status(422).json(responseMsg.error(errorMsg.params.EMAIL,
        errorMsg.messages.EMAIL_NOT_VERIFIED));
  }
  // check password
  const hashedPwd = user.password;
  if (!bcrypt.compareSync(password, hashedPwd)) {
    return res.status(422).json(responseMsg.error(errorMsg.params.PASSWORD,
        errorMsg.messages.PASSWORD_INCORRECT));
  }

  // issue token
  const payload = {usersId: user.usersId, email: user.email};
  const token = auth.generateToken(payload);
  if (token) {
    res.json(responseMsg.success({token, id: user.usersId, email: user.email}));
  } else {
    res.status(500).json(responseMsg.error(errorMsg.params.TOKEN,
        errorMsg.messages.TOKEN_SERVER_ERROR));
  }
};

// get user based on token
exports.getUser = async (req, res, next) => {
  const {token} = req.body;
  const decoded = auth.decodeToken(token);
  if (decoded) {
    res.json(responseMsg.success({id: decoded.usersId, email: decoded.email}));
  } else {
    res.status(422).json(responseMsg.error(errorMsg.params.TOKEN,
        errorMsg.messages.TOKEN_INVALID));
  }
};

// get referral code
exports.getReferral = async (req, res, next) => {
  const {token} = req.body;
  const decoded = auth.decodeToken(token);
  const usersId = decoded.usersId;
  const email = decoded.email;
  if (decoded) {
    const referralExists = await dynamoDb.getUserReferralCode(usersId);
    if (!referralExists.success) {
      return res.status(500).json(referralExists);
    }
    console.log(referralExists);
    if (Object.keys(referralExists.data[0]).length == 0) {
      // no referral code exists
      // generate a referral code
      const referralCode = dynamoDb.generateReferral();
      const payload = {usersId: usersId, referralCode: referralCode};

      // referralToken based on JWT
      const referralToken = auth.generateToken(payload);
      if (referralToken) {
        // store new referral code in db
        ret = await dynamoDb.updateReferral(usersId, email, referralCode, referralToken);
        if (!ret.success) return res.status(500).json(ret);
        res.status(200).json(responseMsg.success(
            {usersId: usersId, referralCode: referralCode, referralToken: referralToken}));
      } else {
        res.status(500).json(responseMsg.error(errorMsg.params.REFERRALCODE,
            errorMsg.messages.REFERRALCODE_GENERATE_ERROR));
      }
    } else {
      // check if referralCode is still valid
      let referralToken = referralExists.data[0]['referral']['referralToken'];
      let referralCode = referralExists.data[0]['referral']['referralCode'];
      const decodeToken = auth.decodeToken(referralToken);
      if (decodeToken) {
        // token still valid
        res.status(200).json(responseMsg.success(
            {usersId: usersId, referralCode: referralCode, referralToken: referralToken}));
      } else {
        // token is invalid; generate a new one
        referralCode = dynamoDb.generateReferral();
        const payload = {usersId: usersId, referralCode: referralCode};

        // referralToken based on JWT
        referralToken = auth.generateToken(payload);
        if (referralToken) {
          // store new referral code in db
          ret = await dynamoDb.updateReferral(usersId, email, referralCode, referralToken);
          if (!ret.success) return res.status(500).json(ret);
          res.status(200).json(responseMsg.success(
              {usersId: usersId, referralCode: referralCode, referralToken: referralToken}));
        } else {
          res.status(500).json(responseMsg.error(errorMsg.params.REFERRALCODE,
              errorMsg.messages.REFERRALCODE_GENERATE_ERROR));
        }
      }
    }
  } else {
    res.status(422).json(responseMsg.error(errorMsg.params.TOKEN,
        errorMsg.messages.TOKEN_INVALID));
  }
};
