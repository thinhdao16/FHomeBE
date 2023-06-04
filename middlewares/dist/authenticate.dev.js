"use strict";

require("dotenv").config();

var jwt = require('jsonwebtoken');

var authenticate = function authenticate(req, res, next) {
  var token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    } else {
      req.user = decoded;
      next();
    }
  });
};

module.exports = authenticate;