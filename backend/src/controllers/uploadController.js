const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Middleware for single file upload field 'document' or 'file'
const uploadMiddleware = upload.single('document');

// @desc    Upload single file to Cloudinary
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully to Cloudinary',
      data: {
        name: req.file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format || req.file.mimetype,
        bytes: req.file.size
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadMiddleware,
  uploadFile
};
