const jwt = require("express-jwt");
const jwt_decode = require("jwt-decode");
const authConfig = require("../config/auth.config");

module.exports.getRouteAuth = function () {
  return jwt({
    secret: authConfig.JWT_SECRET,
    userProperty: "payload",
    algorithms: [authConfig.JWT_ALGORITHM],
  });
};

module.exports.extractJwt = function (req) {
  const authHeader = req.headers["authorization"] || "";
  const keyword = "Bearer ";

  if (authHeader && authHeader.startsWith(keyword)) {
    const token = authHeader.substring(keyword.length);
    return jwt_decode(token);
  }

  return null;
};
