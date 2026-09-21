const db = require('../data/db');

const getAllPublicContent = (req, res) => {
  try {
    const settings = db.getSiteSettings();
    const services = db.getServices();
    const portfolio = db.getPortfolio();
    const workshop = db.getWorkshop();

    return res.status(200).json({
      success: true,
      data: {
        settings,
        services,
        portfolio,
        workshop
      }
    });
  } catch (err) {
    console.error('[PublicContentController] Error fetching content:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve site content.'
    });
  }
};

module.exports = {
  getAllPublicContent
};
