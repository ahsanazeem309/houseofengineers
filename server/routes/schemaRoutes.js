const express = require('express');
const { requireAdminAuth, requireRole } = require('../middleware/authMiddleware');
const {
  getAdminSchema,
  updateAdminSchema
} = require('../controllers/schemaController');

const router = express.Router();

// Require admin authentication for admin schema routes
router.use(requireAdminAuth);

// Get schema configuration
router.get('/', requireRole(['superadmin', 'editor']), getAdminSchema);

// Update schema configuration (superadmin only for security)
router.put('/', requireRole(['superadmin', 'editor']), updateAdminSchema);

module.exports = router;
