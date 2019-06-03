/*
pinocchio.js

Routes for pinocchio system. This will do backend magic stuff.
*/

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send("Pinocchio team gogogogogo!\n");
});

module.exports = router;