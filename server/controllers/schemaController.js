const db = require('../data/db');

/**
 * Public: Get global structured data schema
 * GET /api/content/schema
 */
const getPublicSchema = (req, res) => {
  try {
    const schema = db.getSchema();
    return res.json({ success: true, schema });
  } catch (err) {
    console.error('[Schema Controller] getPublicSchema error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve schema markup.' });
  }
};

/**
 * Admin: Get schema settings
 * GET /api/admin/schema
 */
const getAdminSchema = (req, res) => {
  try {
    const schema = db.getSchema();
    return res.json({ success: true, schema });
  } catch (err) {
    console.error('[Schema Controller] getAdminSchema error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve schema settings.' });
  }
};

/**
 * Admin: Update global schema settings
 * PUT /api/admin/schema
 */
const updateAdminSchema = (req, res) => {
  try {
    const updated = db.updateSchema(req.body);
    return res.json({ success: true, message: 'Structured data schema updated successfully.', schema: updated });
  } catch (err) {
    console.error('[Schema Controller] updateAdminSchema error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update schema settings.' });
  }
};

module.exports = {
  getPublicSchema,
  getAdminSchema,
  updateAdminSchema
};
