const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.get("/", courseController.getCourses);
router.get("/:idOrSlug", courseController.getCourse);

router.post(
  "/",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  courseController.createCourse
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  courseController.updateCourse
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  courseController.deleteCourse
);

router.post(
  "/:id/sections",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  courseController.addSection
);

router.post(
  "/:courseId/sections/:sectionId/lessons",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  courseController.addLesson
);

router.patch(
  "/:id/status",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  courseController.updateCourseStatus
);

module.exports = router;
