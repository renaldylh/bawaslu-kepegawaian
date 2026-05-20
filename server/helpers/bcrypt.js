const bcrypt = require("bcryptjs");

const hashPassword = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

const comparePassword = (pass, hash) => {
  return bcrypt.compareSync(pass, hash);
};

module.exports = { hashPassword, comparePassword };
