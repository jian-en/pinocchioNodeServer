/**
 * accountsTest.js
 * 
 * Testing all /api/accounts endpoints
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

describe("Accounts", () => {

  // register unit tests
  // loads register-unit.csv that has combinations of valid/invalid tests
  // this csv file was created using ACTS.
  function accountRegistrationTest(){
    fs.readFile('./src/tests/testData/csvs/register-unit.csv', 'UTF-8', function(err, csv){
      if(err) console.log(err);
      jquerycsv.toObjects(csv, {}, function (err, csvData) {
        if (err) { console.log(err); }
        // async to get each csvRow and reuse the describe/it
        async.each(csvData, function(csvRow, callback){
          describe("POST /api/accounts/register", () =>{
            it("register unit tests", (done) => {
              // current test request body
              if(DEBUG) console.log(csvRow);
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
                  if(DEBUG){
                    // current test response; console logs for debugging
                    console.log("POST /api/accounts/register response: " + res.text);
                    console.log(res.status + ' ' + status);
                    console.log(res.body);
                  }

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
    }); //fs
  }

  // activateAccount tests
  // a very basic test to test an invalid token. 
  function accountActivationTest(){
    describe("POST /api/accounts/activateAccount", () =>{
      it("invalid token - input string", (done) => {
        // send the request 
        chai.request(app)
        .post('/api/accounts/activateAccount')
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send('token=')
        .end(function(err, res, body) {
          if(err) done(err);
          else {
            if(DEBUG){
              // current test response; console logs for debugging
              console.log("POST /api/accounts/activateAccount response: " + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body['success'].should.be.false;
          }
          done();
        });
      }) //it
    }); //describe
  }

  // login unit tests
  // loads login-unit.csv that has combinations of valid/invalid tests
  // this csv file was created using ACTS.
  function accountLoginAndGetUserTest(){
    fs.readFile('./src/tests/testData/csvs/login-unit.csv', 'UTF-8', function(err, csv){
      if(err) console.log(err);
      jquerycsv.toObjects(csv, {}, function (err, csvData) {
        if (err) { console.log(err); }
        // async to get each csvRow and reuse the describe/it
        async.each(csvData, function(csvRow, callback){
          describe("POST /api/accounts/login", () =>{
            it("login unit tests", (done) => {
              // current test request body
              if(DEBUG) console.log(csvRow);
              var status = parseInt(csvRow.status);

              // send the request 
              chai.request(app)
              .post('/api/accounts/login')
              .set('content-type', 'application/x-www-form-urlencoded')
              .type('form')
              .send('email=' + csvRow.email)
              .send('password=' + csvRow.password)
              .end(function(err, res, body) {
                if(err) done(err);
                else {
                  if(DEBUG){
                    //current test response; console logs for debugging
                    console.log("POST /api/accounts/login response: " + res.text);
                    console.log(res.status + ' ' + status);
                    console.log(res.body);
                  }

                  // assertions
                  res.should.have.status(status);
                  res.body.should.be.a('object');
                  if(status == 200){
                    res.body['success'].should.be.true;
                    res.body['id'].should.equal(csvRow.id);
                    res.body['email'].should.equal(csvRow.email);
                    getUserTests(res.body['token'], res.body['id'], res.body['email']);
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
    }); //fs
  }

  // helper function for getUserTests
  // this is called when a valid user has been logged in; This will piggyback on that
  // valid token to test.
  function getUserTests(userToken, userId, userEmail){
    // login and getUser tests
    describe("POST /api/accounts/getUser", () =>{
      it("valid getUser token", (done) => {
        // send the request 
        chai.request(app)
        .post('/api/accounts/getUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send('token='+userToken)
        .end(function(err, res, body) {
          if(err) done(err);
          else {
            if(DEBUG){
              // current test response; console logs for debugging
              console.log("POST /api/accounts/getUser response: " + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(200);
            res.body['success'].should.be.true;
            res.body['id'].should.equal(userId);
            res.body['email'].should.equal(userEmail);
          }
          done();
        });
      }) //it
    }); //describe
  }

  // getUser tests
  // a very basic test to test an invalid token.
  function accountGetUserInvalidTokenTest(){ 
    describe("POST /api/accounts/getUser", () =>{
      it("invalid token - input string", (done) => {
        // send the request 
        chai.request(app)
        .post('/api/accounts/getUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send('token=')
        .end(function(err, res, body) {
          if(err) done(err);
          else {
            if(DEBUG){
              // current test response; console logs for debugging
              console.log("POST /api/accounts/getUser response: " + res.text);
              console.log(res.status);
              console.log(res.body);
            }

            // assertions
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body['success'].should.be.false;
          }
          done();
        });
      }) //it
    }); //describe
  }

  // run tests
  accountRegistrationTest();
  accountActivationTest();
  accountLoginAndGetUserTest();
  accountGetUserInvalidTokenTest();

}); //accounts
