const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const token = (obj) => {
  return jwt.sign(obj, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { token, verifyToken };
