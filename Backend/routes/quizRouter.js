const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.get("/:id", authenticateUser, quizController.getQuiz);
router.post(
  "/",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  quizController.createQuiz
);
router.post("/:id/submit", authenticateUser, quizController.submitQuiz);
router.get("/:id/attempts", authenticateUser, quizController.getQuizAttempts);

module.exports = router;
