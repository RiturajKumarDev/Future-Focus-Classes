const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authenticateUser } = require("../middleware/auth");

router.get("/dashboard-stats", authenticateUser, studentController.getStudentDashboardStats);
router.post("/ai/tutor", authenticateUser, studentController.askAiTutor);

module.exports = router;
