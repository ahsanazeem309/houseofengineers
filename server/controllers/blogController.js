const db = require('../data/db');
const sanitizeHtml = require('sanitize-html');

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'code', 'pre', 'span'
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'style', 'id', 'data-*'],
    'img': ['src', 'alt', 'width', 'height', 'loading'],
    'a': ['href', 'name', 'target', 'rel']
  }
};

/**
 * Public: Get published blog posts
 * GET /api/content/posts
 */
const getPublicPosts = (req, res) => {
  try {
    const { category, tag, search, page, limit } = req.query;
    const result = db.getPosts({
      category,
      tag,
      search,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 9,
      includeDrafts: false
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Blog Controller] getPublicPosts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve blog posts.' });
  }
};

/**
 * Public: Get single published blog post by slug
 * GET /api/content/posts/:slug
 */
const getPublicPostBySlug = (req, res) => {
  try {
    const post = db.getPostBySlug(req.params.slug, false);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    return res.json({ success: true, post });
  } catch (err) {
    console.error('[Blog Controller] getPublicPostBySlug error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve article.' });
  }
};

/**
 * Admin: Get all blog posts (published & draft)
 * GET /api/admin/posts
 */
const getAdminPosts = (req, res) => {
  try {
    const { category, tag, search, status, page, limit } = req.query;
    const result = db.getPosts({
      category,
      tag,
      search,
      status,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      includeDrafts: true
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Blog Controller] getAdminPosts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve articles.' });
  }
};

/**
 * Admin: Get single blog post by ID
 * GET /api/admin/posts/:id
 */
const getAdminPostById = (req, res) => {
  try {
    const post = db.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }
    return res.json({ success: true, post });
  } catch (err) {
    console.error('[Blog Controller] getAdminPostById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve post details.' });
  }
};

/**
 * Admin: Create new blog post
 * POST /api/admin/posts
 */
const createPost = (req, res) => {
  try {
    const { title, slug, excerpt, content, category, tags, author, authorRole, readingTime, status, featured, coverImage, seo } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Article title is required.' });
    }

    // Sanitize HTML content
    const cleanContent = content ? sanitizeHtml(content, sanitizeOptions) : '';

    const newPost = db.createPost({
      title: title.trim(),
      slug: slug ? slug.trim().toLowerCase() : undefined,
      excerpt: excerpt ? excerpt.trim() : '',
      content: cleanContent,
      category: category || 'Solar Engineering',
      tags: Array.isArray(tags) ? tags : [],
      author: author || (req.user ? req.user.name : 'House of Engineers Editorial'),
      authorRole: authorRole || 'Engineering Contributor',
      readingTime: readingTime || '5 min read',
      status: status || 'draft',
      featured: Boolean(featured),
      coverImage: coverImage || '',
      seo: seo || {}
    });

    return res.status(201).json({ success: true, message: 'Article created successfully.', post: newPost });
  } catch (err) {
    console.error('[Blog Controller] createPost error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create article.' });
  }
};

/**
 * Admin: Update existing blog post
 * PUT /api/admin/posts/:id
 */
const updatePost = (req, res) => {
  try {
    const existing = db.getPostById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const payload = { ...req.body };
    if (payload.content) {
      payload.content = sanitizeHtml(payload.content, sanitizeOptions);
    }

    const updated = db.updatePost(req.params.id, payload);
    return res.json({ success: true, message: 'Article updated successfully.', post: updated });
  } catch (err) {
    console.error('[Blog Controller] updatePost error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update article.' });
  }
};

/**
 * Admin: Delete blog post (Super Admin only)
 * DELETE /api/admin/posts/:id
 */
const deletePost = (req, res) => {
  try {
    if (req.user && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only Super Administrators can delete articles.' });
    }

    const deleted = db.deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Post not found or already deleted.' });
    }
    return res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    console.error('[Blog Controller] deletePost error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete article.' });
  }
};

module.exports = {
  getPublicPosts,
  getPublicPostBySlug,
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  deletePost
};
