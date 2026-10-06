const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    level: {
      type: String,
      enum: ["all", "beginner", "intermediate", "advanced"],
      default: "all",
    },
    language: {
      type: String,
      default: "English",
    },
    pricing: {
      isFree: { type: Boolean, default: false },
      price: { type: Number, default: 0 },
      discountPrice: { type: Number, default: 0 },
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    },
    previewVideoUrl: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "UNPUBLISHED"],
      default: "DRAFT",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    durationHours: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual("sections", {
  ref: "Section",
  localField: "_id",
  foreignField: "course",
});

courseSchema.index(
  { title: "text", description: "text", tags: "text" },
  { language_override: "dummy_language" }
);
courseSchema.index({ status: 1, category: 1, level: 1 });

module.exports = mongoose.model("Course", courseSchema);
