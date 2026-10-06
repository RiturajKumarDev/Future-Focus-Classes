const mongoose = require("mongoose");

const topResultSchema = new mongoose.Schema(
  {
    rank: { type: Number },
    studentName: { type: String, required: true },
    rollNumber: { type: String },
    batch: { type: String },
    schoolName: { type: String },
    score: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopResults", topResultSchema);
