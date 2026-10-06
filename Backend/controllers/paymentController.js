const crypto = require("crypto");
const { Payment, Course, Enrollment, Progress, Coupon, Notification } = require("../models");

// @desc    Create payment order (supports Mock mode or Razorpay if keys set)
// @route   POST /api/payments/create-order
// @access  Private (Student)
exports.createOrder = async (req, res, next) => {
  try {
    const { courseId, couponCode } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if user is already enrolled
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

    let originalPrice = course.pricing.discountPrice || course.pricing.price || 0;
    let finalAmount = originalPrice;
    let discountAmount = 0;

    // Apply Coupon if supplied
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (coupon && coupon.usageCount < coupon.usageLimit) {
        if (!coupon.minPurchase || originalPrice >= coupon.minPurchase) {
          if (coupon.discountType === "percentage") {
            discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          finalAmount = Math.max(0, originalPrice - discountAmount);
        }
      }
    }

    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      orderId,
      user: req.user._id,
      course: course._id,
      amount: finalAmount,
      currency: "INR",
      status: finalAmount === 0 ? "mock_success" : "created",
      paymentMethod: "razorpay_mock",
      couponCode: couponCode || "",
      discountAmount,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount: finalAmount,
        currency: "INR",
        courseTitle: course.title,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_mode",
        isMock: !process.env.RAZORPAY_KEY_SECRET,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and grant course enrollment
// @route   POST /api/payments/verify
// @access  Private (Student)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, razorpaySignature, isMock } = req.body;

    const payment = await Payment.findOne({ orderId }).populate("course");
    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (payment.status === "captured") {
      return res.status(400).json({ success: false, message: "Payment already processed" });
    }

    let isValid = false;

    // Real Razorpay signature verification if secret available
    if (process.env.RAZORPAY_KEY_SECRET && !isMock) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      isValid = generatedSignature === razorpaySignature;
    } else {
      // Mock payment mode for testing/development
      isValid = true;
    }

    if (!isValid) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    payment.paymentId = paymentId || `pay_mock_${Date.now()}`;
    payment.status = "captured";
    await payment.save();

    // If coupon used, increment coupon usage
    if (payment.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: payment.couponCode },
        { $inc: { usageCount: 1 } }
      );
    }

    // Create Enrollment
    await Enrollment.findOneAndUpdate(
      { student: req.user._id, course: payment.course._id },
      {
        payment: payment._id,
        status: "active",
        enrolledAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Initialize Progress
    await Progress.findOneAndUpdate(
      { student: req.user._id, course: payment.course._id },
      { completedLessons: [], overallPercentage: 0 },
      { upsert: true }
    );

    // Increment course enrollment count
    await Course.findByIdAndUpdate(payment.course._id, {
      $inc: { enrollmentCount: 1 },
    });

    // Notify Student
    await Notification.create({
      user: req.user._id,
      title: "Payment Successful! 🎉",
      message: `Your payment of ₹${payment.amount} for "${payment.course.title}" was successful.`,
      type: "enrollment",
      link: `/student/learning/${payment.course._id}`,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and course enrolled successfully!",
      courseId: payment.course._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private (Admin)
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("user", "fullName email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};
