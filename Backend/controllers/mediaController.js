const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");

/**
 * Handle upload of images or videos to Cloudinary
 */
const uploadMedia = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided for upload. Please send an image or video file.",
      });
    }

    const isVideo = file.mimetype.startsWith("video/");
    const isImage = file.mimetype.startsWith("image/");
    const resourceType = isVideo ? "video" : isImage ? "image" : "auto";
    const folder = isVideo
      ? "future_focus_classes/videos"
      : "future_focus_classes/images";

    console.log(
      `[MediaUpload] Uploading ${file.originalname} (${file.mimetype}, ${(file.size / 1024).toFixed(1)} KB) to Cloudinary...`
    );

    const result = await uploadToCloudinary(file.buffer, {
      folder,
      resourceType,
    });

    console.log(`[MediaUpload] Success: ${result.secure_url}`);

    return res.status(200).json({
      success: true,
      message: `${isVideo ? "Video" : "Image"} uploaded successfully to Cloudinary`,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      fileId: result.public_id, // Legacy backwards compatibility for frontend
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      duration: result.duration || null,
      width: result.width || null,
      height: result.height || null,
    });
  } catch (error) {
    console.error("❌ Media upload controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file to Cloudinary",
    });
  }
};

/**
 * Handle deletion of images or videos from Cloudinary
 */
const deleteMedia = async (req, res) => {
  try {
    // Extract identifier from params, query, or body
    const publicIdOrUrl =
      req.params.fileId ||
      req.params[0] ||
      req.body?.url ||
      req.body?.imageUrl ||
      req.body?.videoUrl ||
      req.body?.public_id ||
      req.query?.url;

    if (!publicIdOrUrl) {
      return res.status(400).json({
        success: false,
        message: "File ID or URL is required to delete media",
      });
    }

    const resourceType = req.body?.resource_type || req.query?.resource_type;
    const result = await deleteFromCloudinary(publicIdOrUrl, resourceType);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully from Cloudinary",
      result,
    });
  } catch (error) {
    console.error("❌ Media deletion controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete media from Cloudinary",
    });
  }
};

module.exports = {
  uploadMedia,
  deleteMedia,
};
