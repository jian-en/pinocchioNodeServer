/*
server.js

starts server on port 3000
*/

const express = require('express');
const bodyParser = require('body-parser');

// load app config
const { reactServer } = require('./config.js');

// create express app
var app = express();
var port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// allow cross origin requests (CORS)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", reactServer);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./src/routes/index.js')(app);
require('./src/routes/accounts.router.js')(app);

// app.use('/pinocchio', pinocchio);
// app.use('/api', api);

// listen for requests
app.listen(port, () => {
  console.log('Server listening on port: ' + port);
});
