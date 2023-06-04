require("dotenv").config();
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {

  //const token = req.headers.authorization.split(' ')[1];
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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