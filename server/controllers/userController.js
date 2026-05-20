const { comparePassword } = require("../helpers/bcrypt");
const { token } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Cek apakah email dan password ada
      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Email and password are required",
        };
      }

      // Cek apakah user valid
      let user = await User.findOne({ where: { email } });

      if (!user) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      // Cek apakah password valid
      const isValid = comparePassword(password, user.password);

      if (!isValid) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      // Jika valid, generate token
      const access_token = token({ id: user.id });
      user = user.toJSON();
      const { password: _, createdAt, updatedAt, ...filteredUser } = user;

      res.status(200).json({ access_token, user: filteredUser });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      // Cek apakah email dan password ada
      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Email and password are required",
        };
      }

      // cek apakah user sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw { name: "BadRequest", message: "Email is already registered" };
      }

      // Create user baru
      const user = await User.create({ email, password });

      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
