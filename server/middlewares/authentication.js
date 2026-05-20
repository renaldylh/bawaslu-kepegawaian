const verifyToken = require("../helpers/jwt").verifyToken;
const { raw } = require("express");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;

    // Cek apakah token valid
    if (!authorization) {
      throw { name: "Unauthorized", message: "Invalid Token" };
    }

    // Split Bearer dan tokennya
    const rawToken = authorization.split(" ");
    const tokenType = rawToken[0];
    const tokenValue = rawToken[1];

    if (tokenType !== "Bearer") {
      throw { name: "Unauthorized", message: "Invalid Token" };
    }

    const result = verifyToken(tokenValue);

    const user = await User.findByPk(result.id);
    if (!user) {
      throw { name: "Unauthorized", message: "Invalid Token" };
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;
