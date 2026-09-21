const express = require('express');
const rateLimit = require('express-rate-limit');
const { submitContactInquiry } = require('../controllers/contactController');

const router = express.Router();

// Rate limiter for contact inquiry endpoint to protect against spam / abuse
// 5 requests per 15 minutes per IP
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiry submissions from this connection. Please wait 15 minutes or contact our engineering desk directly via WhatsApp/Phone.',
    errors: ['Rate limit exceeded (maximum 5 submissions per 15 minutes).']
  }
});

/**
 * @route   GET /api/health
 * @desc    API Health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'House of Engineers API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @route   POST /api/contact
 * @desc    Submit project quotation / engineering inquiry
 * @access  Public
 */
router.post('/contact', contactRateLimiter, submitContactInquiry);

module.exports = router;
