const { Review, Course, Enrollment } = require("../models");

// Recalculate average rating of a course
const recalculateCourseRating = async (courseId) => {
  const reviews = await Review.find({ course: courseId });
  if (reviews.length === 0) {
    await Course.findByIdAndUpdate(courseId, {
      "rating.average": 0,
      "rating.count": 0,
    });
    return;
  }
  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = Math.round((sum / reviews.length) * 10) / 10;
  await Course.findByIdAndUpdate(courseId, {
    "rating.average": avg,
    "rating.count": reviews.length,
  });
};

// @desc    Add or update review for course (Enrolled students only)
// @route   POST /api/courses/:courseId/reviews
// @access  Private (Student)
exports.addReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating (1-5) and comment are required.",
      });
    }

    // Check enrollment
    const isEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!isEnrolled && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only enrolled students can review this course.",
      });
    }

    const review = await Review.findOneAndUpdate(
      { course: courseId, student: req.user._id },
      { rating: Number(rating), comment: comment.trim() },
      { upsert: true, new: true, runValidators: true }
    );

    await recalculateCourseRating(courseId);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a course with rating distribution
// @route   GET /api/courses/:courseId/reviews
// @access  Public
exports.getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId })
      .populate("student", "fullName avatar")
      .sort({ createdAt: -1 });

    // Rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });

    res.status(200).json({
      success: true,
      data: reviews,
      distribution,
      totalReviews: reviews.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner or Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (String(review.student) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const courseId = review.course;
    await Review.findByIdAndDelete(req.params.id);
    await recalculateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: "Review removed",
    });
  } catch (error) {
    next(error);
  }
};
