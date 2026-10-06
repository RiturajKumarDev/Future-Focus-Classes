const { Progress, Lesson, Course, Enrollment, Certificate, Notification, User } = require("../models");

// @desc    Get student progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        course: req.params.courseId,
        completedLessons: [],
        overallPercentage: 0,
      });
    }

    const totalLessons = await Lesson.countDocuments({ course: req.params.courseId });

    res.status(200).json({
      success: true,
      data: {
        ...progress.toObject(),
        totalLessons,
        completedCount: progress.completedLessons.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or complete a lesson in progress
// @route   PUT /api/progress/:courseId/lesson/:lessonId
// @access  Private
exports.updateLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const { isCompleted = true } = req.body;

    let progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        course: courseId,
        completedLessons: [],
      });
    }

    const lessonExists = progress.completedLessons.some(
      (id) => String(id) === String(lessonId)
    );

    if (isCompleted && !lessonExists) {
      progress.completedLessons.push(lessonId);
    } else if (!isCompleted && lessonExists) {
      progress.completedLessons = progress.completedLessons.filter(
        (id) => String(id) !== String(lessonId)
      );
    }

    progress.lastAccessedLesson = lessonId;
    progress.lastStudiedAt = new Date();

    // Calculate percentage
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const percentage = totalLessons > 0
      ? Math.min(100, Math.round((progress.completedLessons.length / totalLessons) * 100))
      : 0;

    progress.overallPercentage = percentage;
    await progress.save();

    // Check if course is 100% completed
    if (percentage === 100) {
      // Mark enrollment as completed
      await Enrollment.findOneAndUpdate(
        { student: req.user._id, course: courseId },
        { status: "completed", completedAt: new Date() }
      );

      // Check if certificate already exists
      const existingCert = await Certificate.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!existingCert) {
        const course = await Course.findById(courseId).populate("instructor");
        const student = await User.findById(req.user._id);

        const certId = `LX-${Date.now().toString(36).toUpperCase()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;

        const newCert = await Certificate.create({
          certificateId: certId,
          student: req.user._id,
          course: courseId,
          instructor: course.instructor._id,
          verificationUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/verify/${certId}`,
          completionData: {
            courseName: course.title,
            studentName: student.fullName,
            instructorName: course.instructor.fullName,
            grade: "Excellent",
            hours: course.durationHours || 10,
          },
        });

        // Notify student about Certificate
        await Notification.create({
          user: req.user._id,
          title: "Congratulations! Course Completed 🎓",
          message: `You have completed ${course.title}. Your verified certificate is ready!`,
          type: "certificate",
          link: `/verify/${certId}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Lesson progress updated",
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
