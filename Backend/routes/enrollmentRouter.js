const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { authenticateUser } = require("../middleware/auth");

router.post("/", authenticateUser, enrollmentController.enrollCourse);
router.get("/my", authenticateUser, enrollmentController.getMyEnrollments);
router.get("/check/:courseId", authenticateUser, enrollmentController.checkEnrollment);

module.exports = router;
