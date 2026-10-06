const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

router.get("/:id", authenticateUser, assignmentController.getAssignment);
router.post(
  "/",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  assignmentController.createAssignment
);
router.post("/:id/submit", authenticateUser, assignmentController.submitAssignment);
router.get(
  "/:id/submissions",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  assignmentController.getSubmissions
);
router.put(
  "/submissions/:submissionId/grade",
  authenticateUser,
  authorizeRole("instructor", "admin"),
  assignmentController.gradeSubmission
);

module.exports = router;
