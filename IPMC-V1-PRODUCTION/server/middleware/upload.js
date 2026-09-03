const multer = require('multer');
const path = require('path');

// Local storage fallback (if Cloudinary not configured)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files (jpg, png, webp, svg) are allowed'), false);
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

exports.uploadLocal = multer({ storage: localStorage, fileFilter, limits });

// Try Cloudinary, fallback to local
let uploadCloud;
try {
  const { storage } = require('../config/cloudinary');
  uploadCloud = multer({ storage, fileFilter, limits });
} catch (e) {
  uploadCloud = exports.uploadLocal;
}

exports.upload = uploadCloud;
