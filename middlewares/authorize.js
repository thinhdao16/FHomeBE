const jwt = require("jsonwebtoken");

function authorize(roles) {
  return (req, res, next) => {
    // Get the authorization header from the request.
    const authHeader = req.headers.authorization;

    // If there is no authorization header or it does not start with "Bearer ",
    // return a 401 Unauthorized error.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Extract the token from the authorization header.
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (!roles.includes(req.user.roleName)) {
        return res.status(403).send({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
}


module.exports = authorize;
