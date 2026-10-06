const { Coupon } = require("../models");

// @desc    Apply and validate coupon code
// @route   POST /api/coupons/validate
// @access  Private (Student)
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Please provide a coupon code" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    if (coupon.minPurchase && amount < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((amount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    const finalAmount = Math.max(0, amount - discount);

    res.status(200).json({
      success: true,
      message: `Coupon applied! You saved ₹${discount}`,
      data: {
        code: coupon.code,
        discountAmount: discount,
        finalAmount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private (Admin)
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private (Admin)
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, maxDiscount, minPurchase, expiryDate, usageLimit } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType: discountType || "percentage",
      discountValue,
      maxDiscount: maxDiscount || 0,
      minPurchase: minPurchase || 0,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit || 100,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update coupon (Admin)
// @route   PATCH /api/coupons/:id
// @access  Private (Admin)
exports.toggleCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon is now ${coupon.isActive ? "active" : "inactive"}`,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};
