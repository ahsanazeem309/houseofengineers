const express = require('express');
const { requireAdminAuth, requireRole } = require('../middleware/authMiddleware');
const {
  getPages,
  getPageById,
  createPage,
  updatePage,
  revertPageRevision,
  deletePage
} = require('../controllers/pageController');

const router = express.Router();

// Require valid authentication token for all admin page routes
router.use(requireAdminAuth);

// Pages list and detail (Superadmin & Editor)
router.get('/', requireRole(['superadmin', 'editor']), getPages);
router.get('/:id', requireRole(['superadmin', 'editor']), getPageById);

// Create new page (Superadmin & Editor)
router.post('/', requireRole(['superadmin', 'editor']), createPage);

// Update page / save draft / publish (Superadmin & Editor)
router.put('/:id', requireRole(['superadmin', 'editor']), updatePage);

// Revert to historical revision (Superadmin & Editor)
router.post('/:id/revert/:revisionId', requireRole(['superadmin', 'editor']), revertPageRevision);

// Delete page (Superadmin ONLY)
router.delete('/:id', requireRole(['superadmin']), deletePage);

module.exports = router;
