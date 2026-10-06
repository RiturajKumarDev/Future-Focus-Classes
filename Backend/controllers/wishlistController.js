const { Wishlist } = require("../models");

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.find({ student: req.user._id })
      .populate({
        path: "course",
        populate: [
          { path: "instructor", select: "fullName avatar" },
          { path: "category", select: "name slug" },
        ],
      })
      .sort({ addedAt: -1 });

    const courses = items.map((i) => i.course).filter(Boolean);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle add/remove course from wishlist
// @route   POST /api/wishlist/toggle/:courseId
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const existing = await Wishlist.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        isWishlisted: false,
        message: "Removed from wishlist",
      });
    } else {
      await Wishlist.create({
        student: req.user._id,
        course: courseId,
      });
      return res.status(201).json({
        success: true,
        isWishlisted: true,
        message: "Added to wishlist",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Check if a course is in user wishlist
// @route   GET /api/wishlist/check/:courseId
// @access  Private
exports.checkWishlist = async (req, res, next) => {
  try {
    const item = await Wishlist.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(200).json({
      success: true,
      isWishlisted: !!item,
    });
  } catch (error) {
    next(error);
  }
};
