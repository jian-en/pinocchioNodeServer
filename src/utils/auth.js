const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config.js');

module.exports.checkAuth = (req, res, next) => {
  const token = req.body.token || req.params.token || req.query.token;
  if (!token) {
    res.status(401).json({success: false, message: 'Unauthorized: No token provided'});
  } else {
    jwt.verify(token, jwtSecret, function(err, payload) {
      if (err) {
        res.status(401).json({success: false, message: 'Unauthorized: Invalid token'});
      } else {
        req.email = payload.email;
        req.usersId = payload.usersId;
        delete req.body.token;
        next();
      }
    });
  }
};

module.exports.generateToken = (payload, expiresIn='24h') => {
  try {
    return jwt.sign(payload, jwtSecret, {expiresIn});
  } catch(err) {
    return null;
  }
};

module.exports.decodeToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch(err) {
    return null;
  }
};
