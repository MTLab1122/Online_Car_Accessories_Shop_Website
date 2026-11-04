import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

// Upload single product image or 3D model (Admin only)
router.post('/', protect, authorize('admin'), (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return errorResponse(res, 400, err.message);
    }
    if (!req.file) {
      return errorResponse(res, 400, 'Please select a file to upload.');
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return successResponse(res, 201, 'File uploaded successfully', {
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

// Upload multiple images
router.post('/multiple', protect, authorize('admin'), (req, res) => {
  upload.array('images', 8)(req, res, (err) => {
    if (err) {
      return errorResponse(res, 400, err.message);
    }
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 400, 'Please select files to upload.');
    }

    const files = req.files.map(f => ({
      filename: f.filename,
      url: `/uploads/${f.filename}`,
      size: f.size
    }));

    return successResponse(res, 201, 'Files uploaded successfully', files);
  });
});

export default router;
