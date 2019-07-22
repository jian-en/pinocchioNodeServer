/**
 * eventssTest.js
 *
 * Testing all /api/events endpoints
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const jquerycsv = require('jquery-csv');
const fs = require('fs');
const async = require('async');

// debug print statements
const DEBUG = process.env.DEBUG || false;

// configure chai
chai.use(chaiHttp);

// extends objects with should for easier assertions
chai.should();

describe('Events', () => {
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
    fs.readFile('./src/tests/testData/csvs/login-unit.csv', 'UTF-8', function(err, csv) {
      if (err) console.log(err);
      jquerycsv.toObjects(csv, {}, function(err, csvData) {
        if (err) {
          console.log(err);
        }
        // async to get each csvRow and reuse the describe/it
        async.each(csvData, function(csvRow, callback) {
          describe('POST /api/accounts/login', () =>{
            it('login unit tests', (done) => {
              // current test request body
              if (DEBUG) console.log(csvRow);
              const status = parseInt(csvRow.status);

              // send the request
              chai.request(app)
                  .post('/api/accounts/login')
                  .set('content-type', 'application/x-www-form-urlencoded')
                  .type('form')
                  .send('email=' + csvRow.email)
                  .send('password=' + csvRow.password)
                  .end(function(err, res, body) {
                    if (err) done(err);
                    else {
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
                        createEventsTests(res.body['token']);
                        getEventsTests(res.body['token'], res.body['id']);
                      } else {
                        res.body['success'].should.be.false;
                      }
                    }
                    done();
                  });
            }); // it
          }); // describe
        });
      });
    }); // fs
  }

  /**
   * create event unit tests
   * loads eventsCreate-unit.csv that has combinations of valid/invalid tests
   * this csv file was created using ACTS.
   * @param {string} validToken
   */
  function createEventsTests(validToken) {
    describe('events unit tests', function() {
      fs.readFile('./src/tests/testData/csvs/eventsCreate-unit.csv', 'UTF-8', function(err, csv) {
        if (err) console.log(err);
        jquerycsv.toObjects(csv, {}, function(err, csvData) {
          if (err) {
            console.log(err);
          }
          // async to get each csvRow and reuse the describe/it
          async.each(csvData, function(csvRow, callback) {
            describe('POST /api/events', () =>{
              it('create event unit tests', (done) => {
                // current test request body
                if (DEBUG) console.log(csvRow);
                const status = parseInt(csvRow.status);
                let token = validToken;
                if (!csvRow.token) {
                  token = '';
                }

                // send the request
                chai.request(app)
                    .post('/api/events')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .type('form')
                    .send('name=' + csvRow.name)
                    .send('attendees=' + csvRow.attendees)
                    .send('type=' + csvRow.type)
                    .send('address=' + csvRow.address)
                    .send('city=' + csvRow.city)
                    .send('zipcode=' + csvRow.zipcode)
                    .send('state=' + csvRow.state)
                    .send('promotionUrl=' + csvRow.promotionUrl)
                    .send('token=' + token)
                    .end(function(err, res, body) {
                      if (err) done(err);
                      else {
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
                      }
                      done();
                    });
              }); // it
            }); // describe
          });
        });
      }); // fs
    });
  }


  /**
   * get event tests
   * loads eventTestData.csv to get valid events
   * @param {string} validToken
   * @param {string} organizerId
   */
  function getEventsTests(validToken, organizerId) {
    describe('get event tests', function() {
      const getEventsData = require('./testData/jsons/getEventsTestData.json')[organizerId];
      it('GET /api/events', (done) => {
        chai.request(app)
            .get('/api/events')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send('token=' + validToken)
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
                res.should.have.status(200);
                res.body['success'].should.be.true;
                const eventsList = res.body['data'];
                for (let i = 0; i < eventsList.length; i++) {
                  const eventId = eventsList[i]['eventsId'];
                  eventsList[i]['eventsId'].should.equal(getEventsData[eventId]['eventsId']);
                  eventsList[i]['zipcode'].should.equal(getEventsData[eventId]['zipcode']);
                  eventsList[i]['promotionUrl'].should.equal(
                      getEventsData[eventId]['promotionUrl']);
                  eventsList[i]['organizerId'].should.equal(getEventsData[eventId]['organizerId']);
                  eventsList[i]['address'].should.equal(getEventsData[eventId]['address']);
                  eventsList[i]['city'].should.equal(getEventsData[eventId]['city']);
                  eventsList[i]['attendees'].should.equal(getEventsData[eventId]['attendees']);
                  eventsList[i]['name'].should.equal(getEventsData[eventId]['name']);
                  eventsList[i]['state'].should.equal(getEventsData[eventId]['state']);
                  eventsList[i]['type'].should.equal(getEventsData[eventId]['type']);
                  eventsList[i]['status'].should.equal(getEventsData[eventId]['status']);
                }
              }
              done();
            });
      });
    }); // describe
  }

  // run tests
  getEventsInvalidTokenTest();
  createEventsAndGetEventsTest();
}); // events
