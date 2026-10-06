const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sectionSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "section",
});

module.exports = mongoose.model("Section", sectionSchema);
