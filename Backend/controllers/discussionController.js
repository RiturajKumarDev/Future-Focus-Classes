const { Discussion } = require("../models");

// @desc    Get discussions for a course or specific lesson
// @route   GET /api/discussions/course/:courseId
// @access  Private
exports.getDiscussions = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.query;

    const filter = { course: courseId };
    if (lessonId) filter.lesson = lessonId;

    const discussions = await Discussion.find(filter)
      .populate("user", "fullName avatar role")
      .populate("replies.user", "fullName avatar role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: discussions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a new question/discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res, next) => {
  try {
    const { courseId, lessonId, title, content } = req.body;

    if (!title || !content || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Course, title, and content are required.",
      });
    }

    const discussion = await Discussion.create({
      course: courseId,
      lesson: lessonId || null,
      user: req.user._id,
      title,
      content,
    });

    const populated = await Discussion.findById(discussion._id).populate(
      "user",
      "fullName avatar role"
    );

    res.status(201).json({
      success: true,
      message: "Question posted successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a discussion
// @route   POST /api/discussions/:id/replies
// @access  Private
exports.replyDiscussion = async (req, res, next) => {
  try {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion not found" });
    }

    const isInstructor = req.user.role === "instructor" || req.user.role === "admin";

    discussion.replies.push({
      user: req.user._id,
      content,
      isInstructorReply: isInstructor,
      createdAt: new Date(),
    });

    await discussion.save();

    const populated = await Discussion.findById(discussion._id)
      .populate("user", "fullName avatar role")
      .populate("replies.user", "fullName avatar role");

    res.status(201).json({
      success: true,
      message: "Reply added",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle solved status
// @route   PATCH /api/discussions/:id/solve
// @access  Private
exports.toggleSolved = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion not found" });
    }

    // Only creator or instructor can mark solved
    if (String(discussion.user) !== String(req.user._id) && req.user.role === "student") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    discussion.isSolved = !discussion.isSolved;
    await discussion.save();

    res.status(200).json({
      success: true,
      message: `Discussion marked as ${discussion.isSolved ? "solved" : "unsolved"}`,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};
