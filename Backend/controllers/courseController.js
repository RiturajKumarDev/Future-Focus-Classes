const { Course, Section, Lesson, Category, Enrollment, Review, AuditLog } = require("../models");

// Generate unique slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// @desc    Get all published courses with search, filters, pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      priceType,
      rating,
      sort = "newest",
      page = 1,
      limit = 9,
      status = "PUBLISHED",
    } = req.query;

    const query = {};

    // Only instructors/admins can see draft/review courses, otherwise only PUBLISHED
    if (req.user && (req.user.role === "admin" || req.user.role === "instructor") && req.query.instructor) {
      query.instructor = req.query.instructor;
      if (req.query.status) query.status = req.query.status;
    } else {
      query.status = "PUBLISHED";
    }

    // Search keyword in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Category filter
    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) query.category = catDoc._id;
      else query.category = category;
    }

    // Level filter
    if (level && level !== "all") {
      query.level = level;
    }

    // Price filter
    if (priceType === "free") {
      query["pricing.isFree"] = true;
    } else if (priceType === "paid") {
      query["pricing.isFree"] = false;
    }

    // Rating filter
    if (rating) {
      query["rating.average"] = { $gte: Number(rating) };
    }

    // Sorting
    let sortOptions = {};
    if (sort === "newest") sortOptions = { createdAt: -1 };
    else if (sort === "popular") sortOptions = { enrollmentCount: -1 };
    else if (sort === "rating") sortOptions = { "rating.average": -1 };
    else if (sort === "price-low") sortOptions = { "pricing.price": 1 };
    else if (sort === "price-high") sortOptions = { "pricing.price": -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .populate("instructor", "fullName avatar headline")
      .populate("category", "name slug icon")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID or Slug
// @route   GET /api/courses/:idOrSlug
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const course = await Course.findOne(query)
      .populate("instructor", "fullName avatar headline bio")
      .populate("category", "name slug icon");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Fetch sections and lessons
    const sections = await Section.find({ course: course._id }).sort({ order: 1 });
    const sectionIds = sections.map((s) => s._id);

    const lessons = await Lesson.find({ section: { $in: sectionIds } }).sort({ order: 1 });

    // Combine sections with lessons
    const curriculum = sections.map((section) => ({
      ...section.toObject(),
      lessons: lessons.filter((l) => String(l.section) === String(section._id)),
    }));

    // Fetch reviews
    const reviews = await Review.find({ course: course._id })
      .populate("student", "fullName avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        curriculum,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      language,
      pricing,
      thumbnail,
      requirements,
      learningOutcomes,
    } = req.body;

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const course = await Course.create({
      title,
      slug,
      subtitle: subtitle || "",
      description,
      category,
      instructor: req.user._id,
      level: level || "all",
      language: language || "English",
      pricing: pricing || { isFree: true, price: 0, discountPrice: 0 },
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      requirements: requirements || [],
      learningOutcomes: learningOutcomes || [],
      status: "DRAFT",
    });

    res.status(201).json({
      success: true,
      message: "Course draft created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Verify ownership or admin
    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this course",
      });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (String(course.instructor) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this course",
      });
    }

    await Section.deleteMany({ course: course._id });
    await Lesson.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course and related content deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add section to course
// @route   POST /api/courses/:id/sections
// @access  Private (Instructor/Admin)
exports.addSection = async (req, res, next) => {
  try {
    const { title, order } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const section = await Section.create({
      course: course._id,
      title,
      order: order || 1,
    });

    res.status(201).json({
      success: true,
      message: "Section created",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add lesson to section
// @route   POST /api/courses/:courseId/sections/:sectionId/lessons
// @access  Private (Instructor/Admin)
exports.addLesson = async (req, res, next) => {
  try {
    const { title, description, type, videoUrl, durationMinutes, content, isFreePreview, order } = req.body;

    const lesson = await Lesson.create({
      course: req.params.courseId,
      section: req.params.sectionId,
      title,
      description: description || "",
      type: type || "video",
      videoUrl: videoUrl || "",
      durationMinutes: durationMinutes || 10,
      content: content || "",
      isFreePreview: !!isFreePreview,
      order: order || 1,
    });

    // Update course duration
    await Course.findByIdAndUpdate(req.params.courseId, {
      $inc: { durationHours: Math.round(((durationMinutes || 10) / 60) * 10) / 10 },
    });

    res.status(201).json({
      success: true,
      message: "Lesson created",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish/Unpublish/Submit course status
// @route   PATCH /api/courses/:id/status
// @access  Private (Instructor/Admin)
exports.updateCourseStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Role check: Only admin can PUBLISH or REJECT. Instructors can request PENDING_REVIEW or DRAFT.
    if (["PUBLISHED", "REJECTED"].includes(status) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can approve or reject courses.",
      });
    }

    course.status = status;
    if (rejectionReason) course.rejectionReason = rejectionReason;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course status updated to ${status}`,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
