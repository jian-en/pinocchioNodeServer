/*
controller for index.js
*/

const config = require('../../config.js');

// welcome
exports.welcome = (req, res) => {
  console.log(config);
  res.send('Hello World!\n');
};
