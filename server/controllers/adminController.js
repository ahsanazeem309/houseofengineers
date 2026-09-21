const db = require('../data/db');

// Dashboard Stats
const getDashboardStats = (req, res) => {
  try {
    const inquiries = db.getInquiries();
    const services = db.getServices();
    const portfolio = db.getPortfolio();

    const newInquiries = inquiries.filter((i) => i.status === 'new').length;
    const contacted = inquiries.filter((i) => i.status === 'contacted').length;
    const quoted = inquiries.filter((i) => i.status === 'quoted').length;
    const closed = inquiries.filter((i) => i.status === 'closed').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalInquiries: inquiries.length,
        newInquiries,
        contacted,
        quoted,
        closed,
        totalServices: services.length,
        totalProjects: portfolio.length,
        recentInquiries: inquiries.slice(0, 5)
      }
    });
  } catch (err) {
    console.error('[AdminController] Dashboard stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats.' });
  }
};

// Inquiries / Leads
const getInquiries = (req, res) => {
  try {
    const inquiries = db.getInquiries();
    return res.status(200).json({ success: true, inquiries });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch inquiries.' });
  }
};

const updateInquiry = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updated = db.updateInquiryStatus(id, status, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    return res.status(200).json({ success: true, inquiry: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update inquiry.' });
  }
};

const deleteInquiry = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteInquiry(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    return res.status(200).json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
  }
};

// Site Settings
const getSettings = (req, res) => {
  try {
    const settings = db.getSiteSettings();
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

const updateSettings = (req, res) => {
  try {
    const updated = db.updateSiteSettings(req.body);
    return res.status(200).json({ success: true, settings: updated, message: 'Site settings updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

// Services
const getServices = (req, res) => {
  return res.status(200).json({ success: true, services: db.getServices() });
};

const createService = (req, res) => {
  try {
    const created = db.createService(req.body);
    return res.status(201).json({ success: true, service: created, message: 'Service created successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
};

const updateService = (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateService(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.status(200).json({ success: true, service: updated, message: 'Service updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
};

const deleteService = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteService(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.status(200).json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
};

// Portfolio
const getPortfolio = (req, res) => {
  return res.status(200).json({ success: true, portfolio: db.getPortfolio() });
};

const createPortfolioProject = (req, res) => {
  try {
    const created = db.createPortfolioProject(req.body);
    return res.status(201).json({ success: true, project: created, message: 'Project created successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
};

const updatePortfolioProject = (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updatePortfolioProject(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.status(200).json({ success: true, project: updated, message: 'Project updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

const deletePortfolioProject = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deletePortfolioProject(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

// Workshop
const getWorkshop = (req, res) => {
  return res.status(200).json({ success: true, workshop: db.getWorkshop() });
};

const updateWorkshop = (req, res) => {
  try {
    const { inventory, districts } = req.body;
    const updated = db.updateWorkshop(inventory, districts);
    return res.status(200).json({ success: true, workshop: updated, message: 'Workshop inventory updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update workshop.' });
  }
};

module.exports = {
  getDashboardStats,
  getInquiries,
  updateInquiry,
  deleteInquiry,
  getSettings,
  updateSettings,
  getServices,
  createService,
  updateService,
  deleteService,
  getPortfolio,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  getWorkshop,
  updateWorkshop
};
