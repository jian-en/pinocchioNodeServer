/**
 * accounts_test.js
 * 
 * the hello world of mocha testing
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const jquerycsv = require('jquery-csv');
const fs = require('fs');
const async = require('async');

// configure chai
chai.use(chaiHttp);

// extends objects with should for easier assertions
chai.should();

describe("Accounts", () => {
  fs.readFile('./src/tests/testData/register-unit.csv', 'UTF-8', function(err, csv){
    if(err) console.log(err);
    jquerycsv.toObjects(csv, {}, function (err, csvData) {
      if (err) { console.log(err); }
      // async to get each csvRow and reuse the describe/it
      async.each(csvData, function(csvRow, callback){
        describe("POST /api/accounts/register", () =>{
          it("register unit tests", (done) => {
            // current test request body
            console.log(csvRow);
            var status = parseInt(csvRow.status);

            // send the request 
            chai.request(app)
            .post('/api/accounts/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send('firstname=' + csvRow.firstname)
            .send('lastname=' + csvRow.lastname)
            .send('email=' + csvRow.email)
            .send('password=' + csvRow.password)
            .send('phone=' + csvRow.phone)
            .end(function(err, res, body) {
              if(err) done(err);
              else {
                // current test response; console logs for debugging
                // console.log("POST /api/accounts/register response: " + res.text);
                // console.log(res.status + ' ' + status);
                // console.log(res.body);

                // assertions
                res.should.have.status(status);
                res.body.should.be.a('object');
                if(status == 200){
                  res.body['success'].should.be.true;
                }
                else{
                  res.body['success'].should.be.false;
                }
              }
              done();
            });
          }) //it
        }); //describe
      });
    });
  });
});

describe("helloworld", () => {
  describe("GET /", () =>{
    // test successful register
    it("HALLOOOO", (done) => {
      chai.request(app)
        .get('/')
        .end(function(err, res, body) {
          if(err) done(err);
          else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          }
        });
    });
  });
});
