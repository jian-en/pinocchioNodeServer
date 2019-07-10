const jwt = require('jsonwebtoken');
const config = require('../config.js');
const env = process.env.NODE_ENV || 'local';
const jwtSecret = config[env].jwtSecret;

module.exports.checkAuth = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    res.status(401).json({success: false, message: 'Unauthorized: No token provided'});
  } else {
    jwt.verify(token, jwtSecret, function(err, payload) {
      if (err) {
        res.status(401).json({success: false, message: 'Unauthorized: Invalid token'});
      } else {
        req.email = payload.email;
        req.usersId = payload.usersId;
        next();
      }
    });
  }
};
