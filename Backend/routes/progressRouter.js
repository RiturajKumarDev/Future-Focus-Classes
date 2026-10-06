const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { authenticateUser } = require("../middleware/auth");

router.get("/:courseId", authenticateUser, progressController.getProgress);
router.put(
  "/:courseId/lesson/:lessonId",
  authenticateUser,
  progressController.updateLessonProgress
);

module.exports = router;
