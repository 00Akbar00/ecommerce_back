// Allowed image file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Maximum file size (5MB in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates an image file before upload
 * @param {Object} file - Express file object
 * @returns {Object} - Validation result with success boolean and optional message
 */
const validateImageFile = (file) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, message: 'File size exceeds the 5MB limit.' };
  }

  return { success: true };
};

/**
 * Uploads an image to Cloudinary
 * @param {Object} file - Express file object
 * @param {string} folder - Cloudinary folder to store the image
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file.buffer);
  });
};

module.exports = {
  validateImageFile,
  uploadToCloudinary,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE
};