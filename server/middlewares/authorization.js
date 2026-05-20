const { User } = require("../models");

function isAdmin(req, res, next) {
  try {
    // Cek apakah user adalah admin
    console.log(req.user.role);
    if (req.user.role !== "Admin") {
      throw { name: "Forbidden", message: "You are not Authorized" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function isOwner(req, res, next) {
  try {
    // Cek apakah user adalah admin
    console.log(req.user.role);
    if (req.user.role === "Admin") {
      next();
      return;
    }

    const { id } = req.params;
    const user = await User.findByPk(id);

    // Cek apakah user ada
    if (!user) {
      throw { name: "Not Found", message: "User not found" };
    }

    // Cek apakah user adalah owner (pastikan perbandingan integer)
    if (parseInt(user.id) === parseInt(req.user.id)) {
      next();
      return;
    }

    // Jika bukan admin dan bukan owner, tolak akses
    throw {
      name: "Forbidden",
      message: "You are not authorized",
    };
  } catch (error) {
    next(error);
  }
}

module.exports = { isAdmin, isOwner };
