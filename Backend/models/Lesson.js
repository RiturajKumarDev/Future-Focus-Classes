const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: "pdf" },
});

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["video", "article", "quiz", "assignment"],
      default: "video",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: "",
    },
    resources: [resourceSchema],
    order: {
      type: Number,
      default: 1,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
