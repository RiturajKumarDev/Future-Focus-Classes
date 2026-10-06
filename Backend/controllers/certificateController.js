const { Certificate, Enrollment } = require("../models");

// @desc    Get all certificates for current user
// @route   GET /api/certificates
// @access  Private
exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate("course", "title thumbnail")
      .populate("instructor", "fullName")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate by certificateId (Public verification)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
    })
      .populate("student", "fullName avatar email")
      .populate("course", "title thumbnail durationHours")
      .populate("instructor", "fullName headline avatar");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Invalid Certificate ID. Verification failed.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate verified successfully",
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};
