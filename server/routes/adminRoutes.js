const express = require('express');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/adminController');

const router = express.Router();

// Apply auth guard to all /api/admin routes
router.use(requireAdminAuth);

// Dashboard
router.get('/stats', getDashboardStats);

// Inquiries / Leads
router.get('/inquiries', getInquiries);
router.patch('/inquiries/:id', updateInquiry);
router.delete('/inquiries/:id', deleteInquiry);

// Site Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Services
router.get('/services', getServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Portfolio
router.get('/portfolio', getPortfolio);
router.post('/portfolio', createPortfolioProject);
router.put('/portfolio/:id', updatePortfolioProject);
router.delete('/portfolio/:id', deletePortfolioProject);

// Workshop
router.get('/workshop', getWorkshop);
router.put('/workshop', updateWorkshop);

module.exports = router;
