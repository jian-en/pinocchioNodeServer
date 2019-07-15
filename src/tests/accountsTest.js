/**
 * accounts_test.js
 * 
 * the hello world of mocha testing
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');

// configure chai
chai.use(chaiHttp);

// extends objects with should for easier assertions
chai.should();

describe("Accounts", () => {
  describe("POST /api/accounts/register", () =>{
    // test successful register
    it("should register an account", (done) => {
      chai.request(app)
        .post('/api/accounts/register')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          firstname: 'brian',
          lastname: 'wan',
          email: 'bwan2@andrew.cmu.edu',
          password: 'password',
          phone: '6261441441'
        })
        .end(function(error, response, body) {
          if(error) done(error);
          else done();
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
