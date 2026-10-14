const express = require("express");
const { uploadSingleMedia } = require("../middleware/uploadMiddleware");
const { uploadMedia, deleteMedia } = require("../controllers/mediaController");

const router = express.Router();

// Upload endpoints
router.post("/upload", uploadSingleMedia, uploadMedia);
router.post("/image", uploadSingleMedia, uploadMedia);
router.post("/video", uploadSingleMedia, uploadMedia);

// Delete endpoints
router.post("/delete", deleteMedia);
router.delete("/delete", deleteMedia);
router.delete("/:fileId", deleteMedia);
router.delete("/", deleteMedia);

// Disambiguate root POST for /api/upload vs /api/delete mount points
router.post("/", (req, res, next) => {
  if (req.baseUrl && req.baseUrl.includes("delete")) {
    return deleteMedia(req, res, next);
  }
  return uploadSingleMedia(req, res, () => uploadMedia(req, res, next));
});

module.exports = router;
