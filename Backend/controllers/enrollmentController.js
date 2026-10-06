const { Enrollment, Course, Progress, Notification } = require("../models");

// @desc    Enroll current student in a course (for free courses or after verified payment)
// @route   POST /api/enrollments
// @access  Private (Student)
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId, paymentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Course is not published for enrollments.",
      });
    }

    // Check existing enrollment
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    // Create Enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      payment: paymentId || null,
      status: "active",
    });

    // Initialize Progress tracking
    await Progress.create({
      student: req.user._id,
      course: courseId,
      completedLessons: [],
      overallPercentage: 0,
    });

    // Increment course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    // Send in-app notification
    await Notification.create({
      user: req.user._id,
      title: "Enrollment Confirmed! 🎉",
      message: `You have successfully enrolled in ${course.title}. Start learning now!`,
      type: "enrollment",
      link: `/student/learning/${course._id}`,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled successfully!",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's enrolled courses with progress
// @route   GET /api/enrollments/my
// @access  Private
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: "course",
        populate: [
          { path: "instructor", select: "fullName avatar headline" },
          { path: "category", select: "name slug" },
        ],
      })
      .sort({ enrolledAt: -1 });

    // Fetch progress for each course
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enr) => {
        if (!enr.course) return null;
        const progress = await Progress.findOne({
          student: req.user._id,
          course: enr.course._id,
        });

        return {
          ...enr.toObject(),
          progress: progress ? progress.overallPercentage : 0,
          completedLessonsCount: progress ? progress.completedLessons.length : 0,
          lastAccessedLesson: progress ? progress.lastAccessedLesson : null,
        };
      })
    );

    const validData = enrollmentsWithProgress.filter(Boolean);

    res.status(200).json({
      success: true,
      data: validData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user is enrolled in a specific course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
exports.checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    next(error);
  }
};
