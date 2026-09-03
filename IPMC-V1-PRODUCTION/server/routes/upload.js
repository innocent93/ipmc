const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.post('/', authenticate, authorize('admin', 'editor'), uploadLimiter, upload.single('image'), uploadImage);
router.delete('/', authenticate, authorize('admin'), deleteImage);

module.exports = router;
