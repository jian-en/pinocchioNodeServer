/*
server.js

starts server on port 3000
*/

var express = require('express');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var pinocchio = require('./routes/pinocchio');
var api = require('./routes/api');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', index);
app.use('/pinocchio', pinocchio);
app.use('/api', api);

app.listen(port);

console.log('node API server started on: ' + port);

module.exports = app;
