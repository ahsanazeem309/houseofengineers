const express = require('express');
const { requireAdminAuth, requireRole } = require('../middleware/authMiddleware');
const {
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');

const router = express.Router();

// Require admin authentication for all routes in this router
router.use(requireAdminAuth);

// List & view posts (superadmin & editor)
router.get('/', requireRole(['superadmin', 'editor']), getAdminPosts);
router.get('/:id', requireRole(['superadmin', 'editor']), getAdminPostById);

// Create post (superadmin & editor)
router.post('/', requireRole(['superadmin', 'editor']), createPost);

// Update post (superadmin & editor)
router.put('/:id', requireRole(['superadmin', 'editor']), updatePost);

// Delete post (superadmin only)
router.delete('/:id', requireRole(['superadmin']), deletePost);

module.exports = router;
