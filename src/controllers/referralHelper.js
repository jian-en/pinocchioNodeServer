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
 * generates random alphanumeric string with length 7
 * @return {string}
 */
function generateReferralCode() {
  return Math.random().toString(36).substring(7);
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
  console.log(referralExists);
  if (Object.keys(referralExists.data[0]).length == 0) {
    // no referral code exists
    // generate a referral code
    return await generateReferral(usersId, email, response);
  } else {
    // check if referralCode is still valid
    const referralToken = referralExists.data[0]['referral']['referralToken'];
    const referralCode = referralExists.data[0]['referral']['referralCode'];
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
  const referralCode = generateReferralCode();
  const payload = {usersId: usersId, referralCode: referralCode};

  // referralToken based on JWT
  const referralToken = auth.generateToken(payload);
  if (referralToken) {
    // store new referral code in db
    const ret = await dynamoDb.updateReferral(usersId, email, referralCode, referralToken);
    if (!ret.success) {
      // unsuccessful db call
      response.status = 500;
      response.data = ret;
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
