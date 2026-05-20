const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const ProfileController = require("../controllers/profileController");
const routeProfile = require("./profile");
const authentication = require("../middlewares/authentication");

router.get("/", authentication, ProfileController.userProfile);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use("/profiles", routeProfile);

module.exports = router;
