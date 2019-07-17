/*
index.js

Routes for server root. This will eventually handle rendering website stuff.
*/

module.exports = (app) => {
  const index = require('../controllers/index.js');

  // root
  app.get('/', index.welcome);
};
