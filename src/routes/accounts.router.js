/*
/api/accounts routes; This will handle all account related api calls.
*/

module.exports = (app) => {
    const accounts = require('../controllers/accounts.controller.js');

    // create a new account
    app.post('/api/accounts/register', accounts.validate('register'), accounts.register);

    // activate a newly created account
    app.post('/api/accounts/activateAccount', accounts.activate);

    // log into an account
    app.post('/api/accounts/login', accounts.validate('login'), accounts.login);

    // get user based on token
    app.post('/api/accounts/getUser', accounts.getUser);
}
