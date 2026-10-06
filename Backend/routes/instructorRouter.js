const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.use(authenticateUser, authorizeRole("instructor", "admin"));

router.get("/dashboard", instructorController.getInstructorDashboard);
router.get("/students", instructorController.getInstructorStudents);

module.exports = router;
