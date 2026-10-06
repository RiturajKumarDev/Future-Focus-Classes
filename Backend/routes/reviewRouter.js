const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/auth");

router.get("/course/:courseId", reviewController.getCourseReviews);
router.post("/course/:courseId", authenticateUser, reviewController.addReview);
router.delete("/:id", authenticateUser, reviewController.deleteReview);

module.exports = router;
