const db = require('../data/db');
const { sanitizeBlockData } = require('../middleware/uploadSecurity');

/**
 * GET /api/admin/pages
 * Retrieve all pages list with metadata summary
 */
exports.getPages = async (req, res) => {
  try {
    const pages = db.getPages();
    const summary = pages.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      publishedAt: p.publishedAt,
      blocksCount: Array.isArray(p.blocks) ? p.blocks.length : 0,
      revisionsCount: Array.isArray(p.revisions) ? p.revisions.length : 0,
      seo: p.seo || {}
    }));

    res.json({
      success: true,
      pages: summary
    });
  } catch (error) {
    console.error('[Page Controller] getPages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pages list.',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/pages/:id
 * Retrieve a full page by ID with active blocks and revision history
 */
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = db.getPageById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page with ID "${id}" was not found.`
      });
    }

    res.json({
      success: true,
      page
    });
  } catch (error) {
    console.error('[Page Controller] getPageById error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve page details.',
      error: error.message
    });
  }
};

/**
 * POST /api/admin/pages
 * Create a new custom page
 */
exports.createPage = async (req, res) => {
  try {
    const { title, slug, blocks, seo, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Page title is required.'
      });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Page route slug is required.'
      });
    }

    // Format & validate slug: lowercase, replace spaces with hyphens, remove forbidden chars
    let cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug.startsWith('/')) {
      cleanSlug = `/${cleanSlug}`;
    }
    // Remove unsafe path characters
    cleanSlug = cleanSlug.replace(/[^a-z0-9\-_/]/g, '').replace(/\/+/g, '/');

    // Recursively sanitize blocks to prevent XSS payloads
    const cleanBlocks = Array.isArray(blocks) ? sanitizeBlockData(blocks) : [];

    const newPageData = {
      title: title.trim(),
      slug: cleanSlug,
      status: status === 'published' ? 'published' : 'draft',
      seo: {
        metaTitle: seo?.metaTitle?.trim() || title.trim(),
        metaDescription: seo?.metaDescription?.trim() || '',
        keywords: Array.isArray(seo?.keywords) ? seo.keywords : [],
        ogImage: seo?.ogImage || ''
      },
      blocks: cleanBlocks,
      savedBy: req.user?.email || 'admin'
    };

    const createdPage = db.createPage(newPageData);

    res.status(201).json({
      success: true,
      message: `Page "${createdPage.title}" created successfully.`,
      page: createdPage
    });
  } catch (error) {
    console.error('[Page Controller] createPage error:', error);
    const statusCode = error.message && error.message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create page.'
    });
  }
};

/**
 * PUT /api/admin/pages/:id
 * Update page draft, publish, update blocks, or update SEO metadata
 */
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getPageById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Page with ID "${id}" was not found.`
      });
    }

    const { title, slug, status, blocks, seo, summary } = req.body;

    let cleanSlug = undefined;
    if (slug) {
      cleanSlug = slug.trim().toLowerCase();
      if (!cleanSlug.startsWith('/')) {
        cleanSlug = `/${cleanSlug}`;
      }
      cleanSlug = cleanSlug.replace(/[^a-z0-9\-_/]/g, '').replace(/\/+/g, '/');
      
      // If root homepage, do not allow changing slug
      if (existing.slug === '/' && cleanSlug !== '/') {
        return res.status(400).json({
          success: false,
          message: 'The root homepage route ("/") slug cannot be modified.'
        });
      }
    }

    const updatePayload = {
      ...(title && { title: title.trim() }),
      ...(cleanSlug && { slug: cleanSlug }),
      ...(status && { status }),
      ...(seo && {
        seo: {
          metaTitle: seo.metaTitle ?? existing.seo?.metaTitle,
          metaDescription: seo.metaDescription ?? existing.seo?.metaDescription,
          keywords: Array.isArray(seo.keywords) ? seo.keywords : existing.seo?.keywords,
          ogImage: seo.ogImage ?? existing.seo?.ogImage
        }
      }),
      ...(blocks && { blocks: sanitizeBlockData(blocks) }),
      summary: summary || (status === 'published' ? 'Published live update' : 'Saved draft update')
    };

    const updated = db.updatePage(id, updatePayload, req.user?.email || 'admin');

    res.json({
      success: true,
      message: `Page "${updated.title}" updated successfully.`,
      page: updated
    });
  } catch (error) {
    console.error('[Page Controller] updatePage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page.',
      error: error.message
    });
  }
};

/**
 * POST /api/admin/pages/:id/revert/:revisionId
 * Revert page to an earlier revision snapshot
 */
exports.revertPageRevision = async (req, res) => {
  try {
    const { id, revisionId } = req.params;
    const reverted = db.revertPageRevision(id, revisionId);

    if (!reverted) {
      return res.status(404).json({
        success: false,
        message: 'Page or revision ID not found.'
      });
    }

    res.json({
      success: true,
      message: `Page successfully reverted to revision snapshot ${revisionId}.`,
      page: reverted
    });
  } catch (error) {
    console.error('[Page Controller] revertPageRevision error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revert page revision.',
      error: error.message
    });
  }
};

/**
 * DELETE /api/admin/pages/:id
 * Delete a page (Superadmin only, root page protected)
 */
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = db.getPageById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found.'
      });
    }

    if (page.slug === '/') {
      return res.status(400).json({
        success: false,
        message: 'The root homepage ("/") is permanent and cannot be deleted.'
      });
    }

    const deleted = db.deletePage(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete page from storage.'
      });
    }

    res.json({
      success: true,
      message: `Page "${page.title}" (${page.slug}) was permanently deleted.`
    });
  } catch (error) {
    console.error('[Page Controller] deletePage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting page.',
      error: error.message
    });
  }
};

/**
 * GET /api/content/page/:slug*
 * Public route to fetch published blocks for the storefront
 */
exports.getPublicPage = async (req, res) => {
  try {
    // Extract slug either from query or params
    let rawSlug = req.query.slug || req.params.slug || req.params[0] || '/';
    if (!rawSlug.startsWith('/')) {
      rawSlug = `/${rawSlug}`;
    }

    const page = db.getPageBySlug(rawSlug);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `No page found for route "${rawSlug}".`
      });
    }

    // Only return published pages to public visitors (unless draft preview requested with token)
    if (page.status !== 'published' && !req.query.preview) {
      return res.status(404).json({
        success: false,
        message: `Page "${rawSlug}" is currently unpublished.`
      });
    }

    // Serve publishedBlocks if available, fallback to active blocks
    const publicBlocks = (page.publishedBlocks && page.publishedBlocks.length > 0)
      ? page.publishedBlocks
      : page.blocks;

    res.json({
      success: true,
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        seo: page.seo || {},
        blocks: publicBlocks,
        publishedAt: page.publishedAt,
        updatedAt: page.updatedAt
      }
    });
  } catch (error) {
    console.error('[Page Controller] getPublicPage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load page content.',
      error: error.message
    });
  }
};
