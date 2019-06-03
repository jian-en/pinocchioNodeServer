/*
index.js

Routes for server root. This will eventually handle rendering website stuff.
*/

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send("Hello World!\n");
});

module.exports = router;