const express = require('express');
const { uploadMiddleware, uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Require JWT auth for file uploads

router.post('/', uploadMiddleware, uploadFile);

module.exports = router;
