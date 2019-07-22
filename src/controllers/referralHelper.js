/*
referralHelper.js

helper functions to get/generate referrals
*/

const dynamoDb = require('../models/dynamoDbWrapper.js');

// jwt
const auth = require('../utils/auth.js');

const responseMsg = require('../utils/responseMsg');
const errorMsg = require('../utils/errorMsg');

/**
 * generates random alphanumeric string with length
 * @param {integer} length - specifies string length
 * @return {string}
 */
function generateReferralCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// get referral code
exports.getReferral = async (usersId, email) => {
  const response = {
    status: 200,
    data: {},
  };
  const referralExists = await dynamoDb.getUserReferralCode(usersId);
  if (!referralExists.success) {
    response.status = 500;
    response.data = referralExists;
    return response;
  }
  if (Object.keys(referralExists.data[0]).length == 0) {
    // no referral code exists
    // generate a referral code
    return await generateReferral(usersId, email, response);
  } else {
    // check if referralCode is still valid
    const referralToken = referralExists.data[0]['referralToken'];
    const referralCode = referralExists.data[0]['referralCode'];
    const decodeToken = auth.decodeToken(referralToken);
    if (decodeToken) {
      // token still valid
      response.data = {usersId: usersId, referralCode: referralCode, referralToken: referralToken};
      return response;
    } else {
      // token expired; generate a new one
      return await generateReferral(usersId, email, response);
    }
  }
};

/**
 * helper function to generate a new referral code if there is no referral code
 * or if the referral code is expired.
 * @param {string} usersId
 * @param {string} email
 * @param {dict} response
 */
async function generateReferral(usersId, email, response) {
  const referralCode = generateReferralCode(6);
  const payload = {usersId: usersId, referralCode: referralCode};

  // referralToken based on JWT
  const referralToken = auth.generateToken(payload);
  if (referralToken) {
    // store new referralCode in db
    const referralCodeRet = await dynamoDb.updateReferralCode(usersId,
        email, referralCode);
    if (!referralCodeRet.success) {
      // unsuccessful db call
      response.status = 500;
      response.data = referralCodeRet;
      return response;
    }

    // store new referralToken in db
    const referralTokenRet = await dynamoDb.updateReferralToken(usersId,
        email, referralToken);
    if (!referralTokenRet.success) {
      // unsuccessful db call
      response.status = 500;
      response.data = referralTokenRet;
      return response;
    }

    // successfully stored in db
    response.data = {usersId: usersId, referralCode: referralCode, referralToken: referralToken};
    return response;
  } else {
    // unsucessful generating referral token
    response.status = 500;
    response.data = responseMsg.error(errorMsg.params.REFERRALCODE,
        errorMsg.messages.REFERRALCODE_GENERATE_ERROR);
    return response;
  }
}
