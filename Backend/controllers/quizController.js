const { Quiz, QuizAttempt, Progress, Course } = require("../models");

// @desc    Get quiz by ID (Student view hides correct answers)
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const attemptsCount = await QuizAttempt.countDocuments({
      quiz: quiz._id,
      student: req.user._id,
    });

    // If user is student, hide isCorrect and explanation until submitted
    let sanitizedQuestions = quiz.questions;
    if (req.user.role === "student") {
      sanitizedQuestions = quiz.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        marks: q.marks,
        options: q.options.map((opt) => ({
          _id: opt._id,
          text: opt.text,
        })),
      }));
    }

    res.status(200).json({
      success: true,
      data: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimitMinutes: quiz.timeLimitMinutes,
        passingPercentage: quiz.passingPercentage,
        maxAttempts: quiz.maxAttempts,
        attemptsCount,
        canAttempt: attemptsCount < quiz.maxAttempts,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz (Instructor/Admin)
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin)
exports.createQuiz = async (req, res, next) => {
  try {
    const { course, section, title, description, timeLimitMinutes, passingPercentage, maxAttempts, questions } = req.body;

    const quiz = await Quiz.create({
      course,
      section,
      title,
      description,
      timeLimitMinutes: timeLimitMinutes || 15,
      passingPercentage: passingPercentage || 60,
      maxAttempts: maxAttempts || 3,
      questions: questions || [],
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and evaluate score
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // array of { questionId, selectedOptions: [indices] }
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Check attempts limit
    const previousAttempts = await QuizAttempt.countDocuments({
      quiz: quiz._id,
      student: req.user._id,
    });

    if (previousAttempts >= quiz.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: "Maximum attempts reached for this quiz.",
      });
    }

    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let wrongCount = 0;

    const evaluatedAnswers = quiz.questions.map((q) => {
      maxScore += q.marks || 1;
      const studentAns = (answers || []).find(
        (a) => String(a.questionId) === String(q._id)
      );
      const selected = studentAns ? studentAns.selectedOptions || [] : [];

      // Find correct indices
      const correctIndices = q.options
        .map((opt, idx) => (opt.isCorrect ? idx : null))
        .filter((idx) => idx !== null);

      // Check match
      const isCorrect =
        selected.length === correctIndices.length &&
        selected.every((val) => correctIndices.includes(val));

      let marksObtained = 0;
      if (isCorrect) {
        marksObtained = q.marks || 1;
        totalScore += marksObtained;
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        questionId: q._id,
        questionText: q.questionText,
        selectedOptions: selected,
        correctOptions: correctIndices,
        isCorrect,
        marksObtained,
        explanation: q.explanation,
      };
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passingPercentage;

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user._id,
      course: quiz.course,
      attemptNumber: previousAttempts + 1,
      answers: evaluatedAnswers,
      totalScore,
      maxScore,
      percentage,
      passed,
    });

    // If passed, record in student Progress
    if (passed) {
      await Progress.findOneAndUpdate(
        { student: req.user._id, course: quiz.course },
        { $addToSet: { completedQuizzes: quiz._id } }
      );
    }

    res.status(200).json({
      success: true,
      message: passed ? "Congratulations, you passed! 🎉" : "Quiz completed. Better luck next time!",
      data: {
        attemptId: attempt._id,
        attemptNumber: attempt.attemptNumber,
        totalScore,
        maxScore,
        percentage,
        passed,
        passingPercentage: quiz.passingPercentage,
        correctCount,
        wrongCount,
        evaluatedAnswers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user previous attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Private
exports.getQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.id,
      student: req.user._id,
    }).sort({ attemptNumber: -1 });

    res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};
