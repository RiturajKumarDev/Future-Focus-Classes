const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    verificationUrl: {
      type: String,
      required: true,
    },
    completionData: {
      courseName: String,
      studentName: String,
      instructorName: String,
      grade: String,
      hours: Number,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", certificateSchema);
