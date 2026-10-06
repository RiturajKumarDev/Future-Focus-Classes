const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateUser } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticateUser, authController.getMe);
router.put("/profile", authenticateUser, authController.updateProfile);
router.put("/change-password", authenticateUser, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Aliases for backward compatibility
router.post("/users/register", authController.register);
router.post("/student/register", authController.register);
router.post("/student/login", authController.login);

module.exports = router;
