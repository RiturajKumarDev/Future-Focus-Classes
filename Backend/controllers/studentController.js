const {
  Enrollment,
  Progress,
  Certificate,
  QuizAttempt,
  Course,
  Submission,
} = require("../models");

// @desc    Get student personal dashboard stats
// @route   GET /api/student/dashboard-stats
// @access  Private (Student)
exports.getStudentDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const totalEnrolled = await Enrollment.countDocuments({ student: studentId });
    const completedCourses = await Enrollment.countDocuments({
      student: studentId,
      status: "completed",
    });
    const certificatesCount = await Certificate.countDocuments({ student: studentId });

    // Quiz performance
    const quizAttempts = await QuizAttempt.find({ student: studentId });
    const avgQuizScore = quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizAttempts.length
        )
      : 0;

    // Estimate learning hours from completed lessons
    const progresses = await Progress.find({ student: studentId });
    const totalCompletedLessons = progresses.reduce(
      (sum, p) => sum + (p.completedLessons ? p.completedLessons.length : 0),
      0
    );
    const learningHours = Math.round((totalCompletedLessons * 0.4 + 1) * 10) / 10;

    // Recommended courses (published courses the student is not yet enrolled in)
    const enrolledCourseIds = (await Enrollment.find({ student: studentId })).map(
      (e) => e.course
    );
    const recommendedCourses = await Course.find({
      status: "PUBLISHED",
      _id: { $nin: enrolledCourseIds },
    })
      .populate("instructor", "fullName avatar")
      .populate("category", "name")
      .sort({ "rating.average": -1, enrollmentCount: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      data: {
        totalEnrolled,
        completedCourses,
        certificatesCount,
        learningHours,
        avgQuizScore,
        recommendedCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Tutor query endpoint (Gateway between React and optional FastAPI service)
// @route   POST /api/ai/tutor
// @access  Private
exports.askAiTutor = async (req, res, next) => {
  try {
    const { question, courseId, lessonTitle, lessonContent } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Please provide a question." });
    }

    // Try communicating with FastAPI AI service if configured
    if (process.env.AI_SERVICE_URL) {
      try {
        const response = await fetch(`${process.env.AI_SERVICE_URL}/tutor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, lessonTitle, lessonContent }),
        });
        if (response.ok) {
          const aiData = await response.json();
          return res.status(200).json({ success: true, answer: aiData.answer });
        }
      } catch (aiErr) {
        console.warn("AI Service offline, falling back to local assistant.");
      }
    }

    // Fallback: Intelligent educational context response
    const fallbackAnswer = `**LearnX AI Tutor:**\n\nRegarding your question: *"${question}"*:\n\nIn the context of **${
      lessonTitle || "this course"
    }**, keep the following key concepts in mind:\n- Review the foundational principles presented in this lesson.\n- Break down the problem into smaller logical steps.\n- Check the code samples and reference documentation attached to this module.\n\n*Note: Self-hosted AI Service is currently in standby mode.*`;

    res.status(200).json({
      success: true,
      answer: fallbackAnswer,
    });
  } catch (error) {
    next(error);
  }
};
