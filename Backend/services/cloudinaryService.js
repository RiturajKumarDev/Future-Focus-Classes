const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - Upload options (folder, resourceType, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      folder = "future_focus_classes",
      resourceType = "auto",
      publicId = undefined,
    } = options;

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/**
 * Extract resource type and public ID from a Cloudinary URL or raw identifier
 * @param {string} input - Cloudinary URL or publicId
 * @returns {{ resourceType: string, publicId: string }}
 */
const parseCloudinaryIdentifier = (input) => {
  if (!input) return { resourceType: "image", publicId: "" };

  // If full Cloudinary URL:
  // e.g. https://res.cloudinary.com/nt3mwksb/video/upload/v12345/future_focus_classes/videos/abc.mp4
  const urlMatch = input.match(
    /\/([a-z]+)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/
  );
  if (urlMatch) {
    return {
      resourceType: urlMatch[1] === "video" ? "video" : "image",
      publicId: urlMatch[2],
    };
  }

  // Legacy Google Drive format fallback (/d/FILE_ID)
  const gdriveMatch = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch) {
    return {
      resourceType: "image",
      publicId: gdriveMatch[1],
    };
  }

  return {
    resourceType: "image",
    publicId: input,
  };
};

/**
 * Delete media from Cloudinary by public ID or URL
 * @param {string} publicIdOrUrl - Cloudinary publicId or full URL
 * @param {string} [forcedResourceType] - Optional forced resource_type ('image' or 'video')
 * @returns {Promise<Object>} Cloudinary destroy result
 */
const deleteFromCloudinary = async (publicIdOrUrl, forcedResourceType) => {
  if (!publicIdOrUrl) {
    throw new Error("No public ID or URL provided for deletion");
  }

  const { resourceType, publicId } = parseCloudinaryIdentifier(publicIdOrUrl);
  const targetResourceType = forcedResourceType || resourceType || "image";

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: targetResourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error("❌ Cloudinary destroy error:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  parseCloudinaryIdentifier,
};
