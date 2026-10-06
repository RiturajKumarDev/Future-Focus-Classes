const crypto = require("crypto");
const { User } = require("../models");
const { sendTokenResponse } = require("../utils/token");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../services/emailService");
const { logAuditEvent } = require("../services/auditService");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, role = "student", phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Role safety: only student or instructor can be self-registered
    const userRole = role === "instructor" ? "instructor" : "student";

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: userRole,
      phone: phone || "",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        fullName
      )}&backgroundColor=4f46e5`,
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user).catch((e) => console.log(e.message));

    // Audit log
    logAuditEvent({
      user: user._id,
      action: "USER_REGISTER",
      targetType: "User",
      targetId: user._id,
      ipAddress: req.ip,
    });

    sendTokenResponse(user, 201, res, "Registration successful!");
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact support.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    // Audit log
    logAuditEvent({
      user: user._id,
      action: "USER_LOGIN",
      targetType: "User",
      targetId: user._id,
      ipAddress: req.ip,
    });

    sendTokenResponse(user, 200, res, "Login successful!");
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / Clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, bio, headline, skills, avatar, socialLinks } =
      req.body;

    const fieldsToUpdate = {};
    if (fullName) fieldsToUpdate.fullName = fullName;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (headline !== undefined) fieldsToUpdate.headline = headline;
    if (skills !== undefined) fieldsToUpdate.skills = skills;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (socialLinks) fieldsToUpdate.socialLinks = socialLinks;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password updated successfully!");
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email address.",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (30 minutes)
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user, resetUrl);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successfully!");
  } catch (error) {
    next(error);
  }
};
