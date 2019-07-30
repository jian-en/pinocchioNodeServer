/**
 * eventssTest.js
 *
 * Testing all /api/events endpoints
 */

if (!global.Promise) {
  global.Promise = require('q');
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const auth = require('../utils/auth');
const csv = require('../utils/csv');

// debug print statements
const DEBUG = process.env.DEBUG || false;

// configure chai
chai.use(chaiHttp);

// extends objects with should for easier assertions
chai.should();

// describe('Events', () => {
/**
   * events tests
   * a very basic test to test an invalid token.
   */
function getEventsInvalidTokenTest() {
  describe('GET /api/events', () =>{
    it('invalid token - input string', (done) => {
      // send the request
      chai.request(app)
          .get('/api/events')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send('token=')
          .end(function(err, res, body) {
            if (err) done(err);
            else {
              if (DEBUG) {
                // current test response; console logs for debugging
                console.log('GET /api/events response: ' + res.text);
                console.log(res.status);
                console.log(res.body);
              }

              // assertions
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body['success'].should.be.false;
            }
            done();
          });
    }); // it
  }); // describe
}

/**
   * login unit tests
   * loads login-unit.csv that has combinations of valid/invalid tests
   * this csv file was created using ACTS.
   * this is repeated to get a valid token for events tests
   */
function createEventsAndGetEventsTest() {
  describe('createEventsAndGetEventsTest', function() {
    const loginCsvContent = csv.loads('./src/tests/testData/csvs/login-unit.csv');
    for (let i=0; i<loginCsvContent.length; i++) {
      const userRow = loginCsvContent[i];

      // get only valid users
      if (userRow.status != 200) continue;

      // generate valid token
      const validToken = auth.generateToken({
        usersId: userRow.id,
        email: userRow.email,
      });

      createEventsTests(validToken);
      getEventsTests(validToken, userRow.id);
    }
  });
}

/**
   * create event tests
   * loads eventsCreate-unit.csv that has combinations of valid/invalid tests
   * this csv file was created using ACTS.
   * @param {string} validToken
   */
function createEventsTests(validToken) {
  describe('create events tests', () => {
    const createEventsCsvContent = csv.loads('./src/tests/testData/csvs/eventsCreate-unit.csv');

    // run events tests
    for (let j=0; j<createEventsCsvContent.length; j++) {
      const csvRow = createEventsCsvContent[j];
      createEventsTestsRequest(csvRow, validToken);
    }
  });
}

/**
   * This helper runs each createEvents test
   * @param {dictionary} csvRow req body information
   * @param {string} validToken req body valid token
   */
function createEventsTestsRequest(csvRow, validToken) {
  describe('POST /api/events', () =>{
    it(csvRow.description, async () => {
      // current test request body
      if (DEBUG) console.log(csvRow);
      const status = parseInt(csvRow.status);
      let token = validToken;
      if (!csvRow.token) {
        token = '';
      }

      // send the request
      return await chai.request(app)
          .post('/api/events')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send(`name=${csvRow.name}`)
          .send(`attendees=${csvRow.attendees}`)
          .send(`type=${csvRow.type}`)
          .send(`address=${csvRow.address}`)
          .send(`city=${csvRow.city}`)
          .send(`zipcode=${csvRow.zipcode}`)
          .send(`state=${csvRow.state}`)
          .send(`promotionUrl=${csvRow.promotionUrl}`)
          .send(`token=${token}`)
          .then(function(res) {
            if (DEBUG) {
              // current test response; console logs for debugging
              console.log('POST /api/events response: ' + res.text);
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
          // })
          .catch(function(err) {
            console.log('caught create events error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}


/**
   * get event tests
   * loads eventTestData.csv to get valid events
   * @param {string} validToken
   * @param {string} organizerId
   */
function getEventsTests(validToken, organizerId) {
  describe('GET /api/events', function() {
    const getEventsData = require('./testData/jsons/getEventsTestData.json')[organizerId];
    it(`${organizerId} get events tests`, async () => {
      return await chai.request(app)
          .get('/api/events')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send(`token=${validToken}`)
          .then(function(res) {
            if (DEBUG) {
            // current test response; console logs for debugging
              console.log('GET /api/events response: ' + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(200);
            res.body['success'].should.be.true;
            const eventsList = res.body['data'];
            for (let i = 0; i < eventsList.length; i++) {
              const requestResult = eventsList[i];
              const expectedResult = getEventsData[requestResult['eventsId']];
              for (const key in expectedResult) {
                if (expectedResult.hasOwnProperty(key)) {
                  equestResult[key].should.equal(expectedResult[key]);
                }
              }
            }
          })
          .catch(function(err) {
            console.log('caught getEvents error');
            console.log(err);
            throw err;
          });
    });
  }); // describe
}

/**
   * verify location tests
   * loads verifyLocation-unit.csv that has combinations of valid/invalid tests
   * this csv file was created using ACTS.
   */
function verifyEventLocationTests() {
  describe('events verify location tests', () => {
    const verifyLocationCsvContent = csv.loads('./src/tests/testData/csvs/verifyLocation-unit.csv');

    // run verify location tests
    for (let i=0; i<verifyLocationCsvContent.length; i++) {
      const csvRow = verifyLocationCsvContent[i];
      verifyEventLocationTestsRequest(csvRow);
    }
  });
}

/**
   * This helper runs each verifyEventLocation test
   * @param {dictionary} csvRow each test from the csv file
   */
function verifyEventLocationTestsRequest(csvRow) {
  describe('POST /api/events/verifyLocation', () =>{
    it(csvRow.description, async () => {
      // current test request body
      if (DEBUG) console.log(csvRow);
      const status = parseInt(csvRow.status);

      // send the request
      return await chai.request(app)
          .post('/api/events/verifyLocation')
          .set('content-type', 'application/x-www-form-urlencoded')
          .type('form')
          .send(`eventsId=${csvRow.eventsId}`)
          .send(`latitude=${csvRow.latitude}`)
          .send(`longitude=${csvRow.longitude}`)
          .then(function(res) {
            if (DEBUG) {
              // current test response; console logs for debugging
              console.log('POST /api/events/verifyLocation response: ' + res.text);
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
            console.log('caught verifyEventLocation error');
            console.log(err);
            throw err;
          });
    }); // it
  }); // describe
}

// run tests
getEventsInvalidTokenTest();
createEventsAndGetEventsTest();
verifyEventLocationTests();
// }); // events
