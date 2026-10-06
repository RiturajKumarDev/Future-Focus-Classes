const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const { authenticateUser } = require("../middleware/auth");

router.get("/course/:courseId", authenticateUser, discussionController.getDiscussions);
router.post("/", authenticateUser, discussionController.createDiscussion);
router.post("/:id/replies", authenticateUser, discussionController.replyDiscussion);
router.patch("/:id/solve", authenticateUser, discussionController.toggleSolved);

module.exports = router;
