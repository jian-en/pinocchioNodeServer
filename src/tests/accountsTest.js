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
      async.each(csvData, function(csvRow, callback){
        describe("POST /api/accounts/register", () =>{
          it("register unit tests", (done) => {
            console.log(csvRow);
            var status = parseInt(csvRow.status);
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
                console.log("POST /api/accounts/register response: " + res.text);
                console.log(res.status + ' ' + status);
                res.should.have.status(status);
                res.body.should.be.a('object');
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
