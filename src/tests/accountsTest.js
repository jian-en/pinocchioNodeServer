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

// configure chai
chai.use(chaiHttp);

// extends objects with should for easier assertions
chai.should();

// helper function to read csv files
// toArrays returns array of arrays with headers as first array
function readFile(filepath){
  fs.readFile(filepath, 'UTF-8', function(err, csv){
    if(err) console.log(err);
    jquerycsv.toArrays(csv, {}, function (err, data) {
      if (err) { console.log(err); }
      //console.log(data);
      return data;
    });
  });
}

describe("Accounts", () => {
  fs.readFile('./src/tests/testData/register-unit.csv', 'UTF-8', function(err, csv){
    if(err) console.log(err);
    jquerycsv.toArrays(csv, {}, function (err, csvData) {
      if (err) { console.log(err); }
      var csvHeaders = csvData[0];
      for(var i = 1; i < csvData.length; i++){
        var firstname = csvData[i][csvHeaders.indexOf('firstname')];
        var lastname = csvData[i][csvHeaders.indexOf('lastname')];
        var email = csvData[i][csvHeaders.indexOf('email')];
        var password = csvData[i][csvHeaders.indexOf('password')];
        var phone = csvData[i][csvHeaders.indexOf('phone')];
        var status = parseInt(csvData[i][csvHeaders.indexOf('status')]);

        describe("POST /api/accounts/register", () =>{
          it("register unit tests", (done) => {
            console.log('firstname: ' + firstname);
            console.log('lastname: ' + lastname);
            console.log('email: ' + email);
            console.log('password: ' + password);
            console.log('phone: ' + phone);
            console.log('status: ' + status);
            chai.request(app)
            .post('/api/accounts/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send('firstname=' + firstname)
            .send('lastname=' + lastname)
            .send('email=' + email)
            .send('password=' + password)
            .send('phone=' + phone)
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
      } // for
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
