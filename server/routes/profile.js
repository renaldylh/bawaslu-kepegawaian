const express = require("express");
const authentication = require("../middlewares/authentication");
const { isAdmin, isOwner } = require("../middlewares/authorization");
const ProfileController = require("../controllers/profileController");
const router = express.Router();

// get all users (admin only)
router.get("/", authentication, isAdmin, ProfileController.getAllUsers);
router.post("/", authentication, ProfileController.createBiodata);
router.put("/:id", authentication, isOwner, ProfileController.updateBiodata);
router.get("/:id", authentication, isOwner, ProfileController.getUserById);
router.delete("/:id", authentication, isOwner, ProfileController.deleteUser);

module.exports = router;
