const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");

const rootDir = require("./utils/pathUtil");
const errorHandler = require("./middleware/errorHandler");

// Route handlers
const authRouter = require("./routes/authRouter");
const courseRouter = require("./routes/courseRouter");
const categoryRouter = require("./routes/categoryRouter");
const enrollmentRouter = require("./routes/enrollmentRouter");
const progressRouter = require("./routes/progressRouter");
const quizRouter = require("./routes/quizRouter");
const assignmentRouter = require("./routes/assignmentRouter");
const reviewRouter = require("./routes/reviewRouter");
const wishlistRouter = require("./routes/wishlistRouter");
const certificateRouter = require("./routes/certificateRouter");
const paymentRouter = require("./routes/paymentRouter");
const couponRouter = require("./routes/couponRouter");
const notificationRouter = require("./routes/notificationRouter");
const discussionRouter = require("./routes/discussionRouter");
const adminRouter = require("./routes/adminRouter");
const instructorRouter = require("./routes/instructorRouter");
const studentRouter = require("./routes/studentRouter");
const mediaRouter = require("./routes/mediaRouter");

// Backward compatibility legacy routes
const { resourcesRouter } = require("./routes/resourcesRouter");
const { topResultRouter } = require("./routes/topResultRouter");

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

const allowedOrigin = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, "")
  : "http://localhost:5173";

app.use(
  cors({
    origin: [allowedOrigin, allowedOrigin + "/", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(rootDir, "public")));

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Mount LearnX LMS API Routes
app.use("/api/auth", authRouter);
app.use("/api", authRouter); // Supports legacy /api/student/login, /api/student/register
app.use("/api/courses", courseRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/certificates", certificateRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/discussions", discussionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/student", studentRouter);

// Media & Cloudinary Storage (Image & Video Upload / Delete)
app.use("/api/upload", mediaRouter);
app.use("/api/delete", mediaRouter);
app.use("/api/media", mediaRouter);

// Legacy routes preserved
if (resourcesRouter) app.use("/api/resources", resourcesRouter);
if (topResultRouter) app.use("/api/toppers", topResultRouter);

// Root healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LearnX LMS API Gateway is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API Route not found" });
});

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 LearnX Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection error : ", error);
  });

module.exports = app;
