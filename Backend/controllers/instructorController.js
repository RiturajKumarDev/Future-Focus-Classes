const { Course, Enrollment, Payment, Review, Submission, User } = require("../models");

// @desc    Get instructor dashboard metrics and overview
// @route   GET /api/instructor/dashboard
// @access  Private (Instructor)
exports.getInstructorDashboard = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;

    // Total unique enrolled students
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const uniqueStudents = new Set(enrollments.map((e) => String(e.student))).size;

    // Calculate revenue from captured payments for this instructor's courses
    const payments = await Payment.find({
      course: { $in: courseIds },
      status: { $in: ["captured", "mock_success"] },
    });
    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Pending assignment submissions to grade
    const pendingSubmissions = await Submission.countDocuments({
      course: { $in: courseIds },
      status: "submitted",
    });

    // Average rating across instructor courses
    const ratedCourses = courses.filter((c) => c.rating && c.rating.count > 0);
    const avgRating = ratedCourses.length > 0
      ? Math.round(
          (ratedCourses.reduce((sum, c) => sum + c.rating.average, 0) / ratedCourses.length) * 10
        ) / 10
      : 5.0;

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents: uniqueStudents,
        totalRevenue,
        pendingSubmissions,
        avgRating,
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students enrolled in instructor courses
// @route   GET /api/instructor/students
// @access  Private (Instructor)
exports.getInstructorStudents = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student", "fullName email avatar createdAt")
      .populate("course", "title")
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};
