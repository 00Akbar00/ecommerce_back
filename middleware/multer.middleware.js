const multer = require("multer");
const path = require("path");

// Set up storage (we'll store the files in memory for Cloudinary)
const storage = multer.memoryStorage();

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Limits (optional)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
