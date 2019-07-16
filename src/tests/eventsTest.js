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

describe("Events", () => {

  // events tests
  // a very basic test to test an invalid token. 
  describe("GET /api/events", () =>{
    it("invalid token - input string", (done) => {
      // send the request 
      chai.request(app)
      .get('/api/events')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('token=')
      .end(function(err, res, body) {
        if(err) done(err);
        else {
          if(DEBUG){
            // current test response; console logs for debugging
            console.log("GET /api/events response: " + res.text);
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
    }) //it
  }); //describe

}); //accounts
