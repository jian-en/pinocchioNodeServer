/**
 * accountsTest.js
 *
 * Testing all /api/accounts endpoints
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const csv = require('../utils/csv');

// debug print statements
const DEBUG = process.env.DEBUG || false;

// configure chai
chai.use(chaiHttp);

// extends objects with should for easier assertions
chai.should();

/**
 * account register tests
 * loads register-tests.csv that has combinations of valid/invalid tests
 * this csv file was created using ACTS.
 */
function accountRegistrationTest() {
  describe('account registration tests', () => {
    const accountRegCsvContent = csv.loads('./src/tests/testData/csvs/register-tests.csv');

    // run account registration tests
    for (let i=0; i<accountRegCsvContent.length; i++) {
      const csvRow = accountRegCsvContent[i];
      accountRegistrationTestRequest(csvRow);
    }
  });
}

/**
 * helper to run account registration test
 * @param {dictionary} csvRow each account registration test request
 */
function accountRegistrationTestRequest(csvRow) {
  describe('POST /api/accounts/register', () =>{
    it(csvRow.description, async () => {
      // current test request body
      if (DEBUG) console.log(csvRow);
      const status = parseInt(csvRow.status);

      // send the request
      return await chai.request(app)
          .post('/api/accounts/register')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send(`firstname=${csvRow.firstname}`)
          .send(`lastname=${csvRow.lastname}`)
          .send(`email=${csvRow.email}`)
          .send(`password=${csvRow.password}`)
          .send(`phone=${csvRow.phone}`)
          .send(`publicKey=${csvRow.publicKey}`)
          .then(function(res) {
            if (DEBUG) {
              // current test response; console logs for debugging
              console.log('POST /api/accounts/register response: ' + res.text);
              console.log(res.status + ' ' + status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(status);
            res.body.should.be.a('object');
            if (status == 200) {
              res.body['success'].should.be.true;
            } else {
              res.body['success'].should.be.false;
            }
          })
          .catch(function(err) {
            console.log('caught account registration test error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}

/**
 * activateAccount tests
 * a very basic test to test an invalid token.
 */
function accountActivationTest() {
  describe('POST /api/accounts/activateAccount', () =>{
    it('invalid token - input string', async () => {
      // send the request
      return await chai.request(app)
          .post('/api/accounts/activateAccount')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send('token=')
          .then(function(res) {
            if (DEBUG) {
              // current test response; console logs for debugging
              console.log('POST /api/accounts/activateAccount response: ' + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body['success'].should.be.false;
          })
          .catch(function(err) {
            console.log('caught account activation test error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}

/**
 * account register tests
 * loads register-tests.csv that has combinations of valid/invalid tests
 * this csv file was created using ACTS.
 */
function accountLoginTest() {
  describe('account login tests', () => {
    const accountLoginCsvContent = csv.loads('./src/tests/testData/csvs/login-tests.csv');

    // run account login tests
    for (let i=0; i<accountLoginCsvContent.length; i++) {
      const csvRow = accountLoginCsvContent[i];
      accountLoginTestRequest(csvRow);
    }
  });
}

/**
 * helper to run account login requests
 * @param {dictionary} csvRow each account login request
 */
function accountLoginTestRequest(csvRow) {
  describe('POST /api/accounts/login', () =>{
    it(csvRow.description, async () => {
      // current test request body
      if (DEBUG) console.log(csvRow);
      const status = parseInt(csvRow.status);

      // send the request
      return await chai.request(app)
          .post('/api/accounts/login')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send(`email=${csvRow.email}`)
          .send(`password=${csvRow.password}`)
          .then(function(res) {
            if (DEBUG) {
              // current test response; console logs for debugging
              console.log('POST /api/accounts/login response: ' + res.text);
              console.log(res.status + ' ' + status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(status);
            res.body.should.be.a('object');
            if (status == 200) {
              res.body['success'].should.be.true;
              res.body['id'].should.equal(csvRow.id);
              res.body['email'].should.equal(csvRow.email);
              getUserTests(res.body['token'], res.body['id'], res.body['email']);
            } else {
              res.body['success'].should.be.false;
            }
          })
          .catch(function(err) {
            console.log('caught accounts login error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}

/**
 * helper function for getUserTests
 * this is called when a valid user has been logged in; This will piggyback on that
 * valid token to test.
 * @param {string} userToken
 * @param {string} userId
 * @param {string} userEmail
 */
function getUserTests(userToken, userId, userEmail) {
  // login and getUser tests
  describe('POST /api/accounts/getUser', () =>{
    it(`valid - ${userId} getUser token`, async () => {
      // send the request
      return await chai.request(app)
          .post('/api/accounts/getUser')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send(`token=${userToken}`)
          .then(function(res) {
            if (DEBUG) {
            // current test response; console logs for debugging
              console.log('POST /api/accounts/getUser response: ' + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(200);
            res.body['success'].should.be.true;
            res.body['id'].should.equal(userId);
            res.body['email'].should.equal(userEmail);
          })
          .catch(function(err) {
            console.log('caught get users error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}

/**
 * getUser tests
 * a very basic test to test an invalid token.
 */
function accountGetUserInvalidTokenTest() {
  describe('POST /api/accounts/getUser', () =>{
    it('invalid token - input string', async () => {
      // send the request
      return await chai.request(app)
          .post('/api/accounts/getUser')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send('token=')
          .then(function(res) {
            if (DEBUG) {
            // current test response; console logs for debugging
              console.log('POST /api/accounts/getUser response: ' + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body['success'].should.be.false;
          })
          .catch(function(err) {
            console.log('caught invalid token getUser error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}

// run tests
accountRegistrationTest();
accountLoginTest();
accountActivationTest();
accountGetUserInvalidTokenTest();
