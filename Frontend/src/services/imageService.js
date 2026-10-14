import { API_BASE_URL } from "./api";

/**
 * Extract Cloudinary public ID or legacy identifier from URL
 * @param {string} url - Media URL
 * @returns {string} public ID
 */
export function extractId(url) {
    if (!url || typeof url !== "string") return "";

    // Cloudinary URL extraction: matches public_id (including folder path)
    const cloudinaryMatch = url.match(
        /\/([a-z]+)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/
    );
    if (cloudinaryMatch) {
        return cloudinaryMatch[2];
    }

    // Google Drive URL extraction (/d/FILE_ID)
    const gdriveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (gdriveMatch) {
        return gdriveMatch[1];
    }

    return url;
}

/**
 * Upload image to Cloudinary via backend API
 * @param {File|Blob} file - Image file
 * @returns {Promise<string>} Direct Cloudinary HTTPS URL
 */
export const uploadImageToSever = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    try {
        const uploadUrl = `${API_BASE_URL}upload`;
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.success && (data.secure_url || data.url)) {
            const imageUrl = data.secure_url || data.url;
            console.log("Cloudinary Image URL:", imageUrl);
            return imageUrl;
        } else {
            console.error("Upload failed:", data.message);
            alert("Upload failed: " + (data.message || "Unknown error"));
            return "";
        }
    } catch (error) {
        console.error("Image upload error:", error);
        alert("Upload error: " + error.message);
        return "";
    }
};

/**
 * Upload video to Cloudinary via backend API
 * @param {File|Blob} file - Video file (mp4, webm, mov, etc.)
 * @returns {Promise<string>} Direct Cloudinary HTTPS URL
 */
export const uploadVideoToServer = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("video", file);

    try {
        const uploadUrl = `${API_BASE_URL}upload`;
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.success && (data.secure_url || data.url)) {
            const videoUrl = data.secure_url || data.url;
            console.log("Cloudinary Video URL:", videoUrl);
            return videoUrl;
        } else {
            console.error("Video upload failed:", data.message);
            alert("Video upload failed: " + (data.message || "Unknown error"));
            return "";
        }
    } catch (error) {
        console.error("Video upload error:", error);
        alert("Video upload error: " + error.message);
        return "";
    }
};

/**
 * Generic media uploader for image or video to Cloudinary
 * @param {File|Blob} file
 * @returns {Promise<{ success: boolean, url?: string, secure_url?: string, public_id?: string, resource_type?: string, message?: string }>}
 */
export const uploadMediaToServer = async (file) => {
    if (!file) return { success: false, url: "", message: "No file provided" };
    const formData = new FormData();
    const isVideo = file.type && file.type.startsWith("video/");
    formData.append(isVideo ? "video" : "image", file);

    try {
        const uploadUrl = `${API_BASE_URL}upload`;
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Media upload error:", error);
        return { success: false, url: "", message: error.message };
    }
};

/**
 * Delete image or video from Cloudinary via backend API
 * @param {string} imageUrl - Cloudinary image/video URL or publicId
 */
export const deleteImageToSever = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
        const deleteUrl = `${API_BASE_URL}delete`;
        const res = await fetch(deleteUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: imageUrl,
                fileId: extractId(imageUrl),
            }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Delete media error:", error);
        return { success: false, error: error.message };
    }
};

// Aliases for clean naming
export const deleteMediaFromServer = deleteImageToSever;
export const uploadImageToServer = uploadImageToSever;
