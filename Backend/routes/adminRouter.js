const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.use(authenticateUser, authorizeRole("admin"));

router.get("/dashboard", adminController.getAdminDashboardStats);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatusOrRole);
router.get("/audit-logs", adminController.getAuditLogs);

module.exports = router;
