const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticateToken = require('../middleware/authMiddleware');
const { uploadFileToS3, deleteFromS3 } = require('../utils/s3');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

/**
 * @desc Upload image to AWS S3 (Admin Protected)
 * @route POST /api/upload
 * @access Admin
 */
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const fileUrl = await uploadFileToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      success: true,
      message: 'Image uploaded successfully to S3',
      url: fileUrl,
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image to S3',
    });
  }
});

module.exports = router;
