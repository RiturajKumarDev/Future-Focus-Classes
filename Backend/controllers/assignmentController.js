const { Assignment, Submission, Progress, Notification, Course } = require("../models");

// @desc    Get assignment by ID with user's submission if any
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    let mySubmission = null;
    if (req.user.role === "student") {
      mySubmission = await Submission.findOne({
        assignment: assignment._id,
        student: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...assignment.toObject(),
        mySubmission,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Instructor/Admin)
exports.createAssignment = async (req, res, next) => {
  try {
    const { course, section, title, description, instructions, deadline, maxMarks, attachments } = req.body;

    const assignment = await Assignment.create({
      course,
      section,
      title,
      description,
      instructions: instructions || "",
      deadline: new Date(deadline),
      maxMarks: maxMarks || 100,
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res, next) => {
  try {
    const { submissionText, githubUrl, liveUrl, attachments } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    // Check if past deadline
    const isPastDeadline = new Date() > new Date(assignment.deadline);

    const submission = await Submission.findOneAndUpdate(
      { assignment: assignment._id, student: req.user._id },
      {
        course: assignment.course,
        submissionText: submissionText || "",
        githubUrl: githubUrl || "",
        liveUrl: liveUrl || "",
        attachments: attachments || [],
        status: "submitted",
        submittedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Notify instructor
    const course = await Course.findById(assignment.course);
    if (course) {
      await Notification.create({
        user: course.instructor,
        title: "New Assignment Submission 📄",
        message: `${req.user.fullName} submitted "${assignment.title}".`,
        type: "assignment",
        link: `/instructor/submissions`,
      });
    }

    res.status(200).json({
      success: true,
      message: isPastDeadline ? "Submitted (Late submission marked)" : "Submitted successfully!",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions for an assignment (Instructor/Admin)
// @route   GET /api/assignments/:id/submissions
// @access  Private (Instructor/Admin)
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate("student", "fullName email avatar")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade a submission
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private (Instructor/Admin)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findById(req.params.submissionId)
      .populate("assignment")
      .populate("student");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    submission.score = Number(score);
    submission.feedback = feedback || "";
    submission.status = "graded";
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();
    await submission.save();

    // Mark as completed in progress if passing score (>= 50%)
    if (Number(score) >= (submission.assignment.maxMarks * 0.5)) {
      await Progress.findOneAndUpdate(
        { student: submission.student._id, course: submission.course },
        { $addToSet: { completedAssignments: submission.assignment._id } }
      );
    }

    // Send notification to student
    await Notification.create({
      user: submission.student._id,
      title: "Assignment Graded! 📝",
      message: `Your submission for "${submission.assignment.title}" received ${score}/${submission.assignment.maxMarks}.`,
      type: "assignment",
      link: `/student/assignments`,
    });

    res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};
