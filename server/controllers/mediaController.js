const db = require('../data/db');
const { getStorageDriver } = require('../storage/storageDriver');

/**
 * Upload single or multiple media assets
 * POST /api/admin/media/upload
 */
const uploadMediaAssets = async (req, res) => {
  try {
    const storage = getStorageDriver();
    const processedFiles = req.processedFiles || (req.processedFile ? [req.processedFile] : []);

    if (processedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid image files provided for upload.'
      });
    }

    const savedAssets = [];

    for (const item of processedFiles) {
      // 1. Save to modular storage driver (local filesystem or S3)
      const storageResult = await storage.saveFile({
        buffer: item.buffer,
        originalName: item.originalName,
        mimeType: item.mimeType,
        key: item.key
      });

      // 2. Persist metadata into database
      const assetRecord = db.addMedia({
        filename: storageResult.key,
        originalName: item.originalName,
        url: storageResult.url,
        mimeType: item.mimeType,
        fileSize: storageResult.size,
        dimensions: item.dimensions || { width: 0, height: 0 },
        altText: req.body.altText || item.originalName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        uploadedBy: req.user ? req.user.email : 'admin'
      });

      savedAssets.push(assetRecord);
    }

    return res.status(201).json({
      success: true,
      message: `Successfully processed and uploaded ${savedAssets.length} asset(s).`,
      assets: savedAssets
    });
  } catch (err) {
    console.error('[UploadMedia Controller Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'An error occurred while uploading media assets.'
    });
  }
};

/**
 * Retrieve paginated media assets
 * GET /api/admin/media
 */
const getMediaAssets = (req, res) => {
  try {
    const { search, type, page, limit } = req.query;
    const result = db.getMedia({
      search,
      type,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 24
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve media library assets.'
    });
  }
};

/**
 * Get single media asset by ID
 * GET /api/admin/media/:id
 */
const getMediaAssetById = (req, res) => {
  try {
    const asset = db.getMediaById(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found.'
      });
    }
    return res.json({
      success: true,
      asset
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching media asset.'
    });
  }
};

/**
 * Update media asset metadata (e.g. alt text)
 * PATCH /api/admin/media/:id
 */
const updateMediaAsset = (req, res) => {
  try {
    const { altText } = req.body;
    const updated = db.updateMedia(req.params.id, { altText });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Media asset metadata updated successfully.',
      asset: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error updating media asset metadata.'
    });
  }
};

/**
 * Delete media asset
 * DELETE /api/admin/media/:id
 */
const deleteMediaAsset = async (req, res) => {
  try {
    const asset = db.getMediaById(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found.'
      });
    }

    // 1. Delete physical/cloud file via modular storage driver
    const storage = getStorageDriver();
    await storage.deleteFile(asset.filename);

    // 2. Remove record from database
    db.deleteMedia(req.params.id);

    return res.json({
      success: true,
      message: 'Media asset permanently removed from storage.'
    });
  } catch (err) {
    console.error('[DeleteMedia Controller Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Error deleting media asset.'
    });
  }
};

module.exports = {
  uploadMediaAssets,
  getMediaAssets,
  getMediaAssetById,
  updateMediaAsset,
  deleteMediaAsset
};
