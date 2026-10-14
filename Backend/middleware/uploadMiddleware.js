const multer = require("multer");

// Use memory storage so files are held in RAM buffer and streamed to Cloudinary
const storage = multer.memoryStorage();

// File filter to accept images and videos
const fileFilter = (req, file, cb) => {
  const allowedMimePrefixes = ["image/", "video/", "audio/", "application/pdf"];
  const isAllowed = allowedMimePrefixes.some((prefix) =>
    file.mimetype.startsWith(prefix)
  );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: image, video, audio, pdf.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max limit for videos and images
  },
});

// Middleware that accepts any file field ('image', 'video', 'file', etc.)
// and populates req.file with the primary uploaded file
const uploadSingleMedia = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 150MB limit",
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (req.files && req.files.length > 0) {
      // Set req.file to first file for easy access
      req.file = req.files[0];
    }

    next();
  });
};

module.exports = {
  uploadSingleMedia,
  upload,
};
