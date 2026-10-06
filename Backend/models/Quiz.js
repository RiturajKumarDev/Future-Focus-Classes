const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ["MCQ", "Multiple", "TrueFalse"],
    default: "MCQ",
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  marks: { type: Number, default: 1 },
  explanation: { type: String, default: "" },
});

const quizSchema = new mongoose.Schema(
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
    },
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    timeLimitMinutes: {
      type: Number,
      default: 15,
    },
    passingPercentage: {
      type: Number,
      default: 60,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
