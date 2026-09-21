const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { requireAdminAuth, requireRole } = require('../middleware/authMiddleware');
const { upload, validateUploadSecurity } = require('../middleware/uploadSecurity');
const {
  uploadMediaAssets,
  getMediaAssets,
  getMediaAssetById,
  updateMediaAsset,
  deleteMediaAsset
} = require('../controllers/mediaController');

// Rate limiter for upload endpoint (prevent flood / disk exhaustion attacks)
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 upload requests per window
  message: {
    success: false,
    message: 'Upload rate limit exceeded. Please wait a few minutes before uploading more files.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// All media endpoints require valid admin authentication
router.use(requireAdminAuth);

// GET /api/admin/media - Paginated, searchable media gallery
router.get('/', requireRole(['superadmin', 'editor']), getMediaAssets);

// GET /api/admin/media/:id - Single asset
router.get('/:id', requireRole(['superadmin', 'editor']), getMediaAssetById);

// POST /api/admin/media/upload - Multi/Single file upload with magic number & sharp security
router.post(
  '/upload',
  uploadRateLimiter,
  requireRole(['superadmin', 'editor']),
  upload.array('files', 10),
  validateUploadSecurity,
  uploadMediaAssets
);

// PATCH /api/admin/media/:id - Update alt text or title
router.patch('/:id', requireRole(['superadmin', 'editor']), updateMediaAsset);

// DELETE /api/admin/media/:id - Superadmin only
router.delete('/:id', requireRole(['superadmin']), deleteMediaAsset);

module.exports = router;
