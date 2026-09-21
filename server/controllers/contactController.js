const validator = require('validator');
const { sendInquiryNotification } = require('../config/mailer');
const db = require('../data/db');

/**
 * Basic string sanitization to prevent script injection
 * @param {string} str
 * @returns {string}
 */
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return validator.escape(str.trim());
};

/**
 * Handle Contact / RFQ Submission
 */
const submitContactInquiry = async (req, res) => {
  try {
    const { name, company, email, phone, service, message, drawingNote } = req.body;
    const errors = [];

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Full name is required and must be at least 2 characters.');
    }

    if (!email || typeof email !== 'string' || !validator.isEmail(email.trim())) {
      errors.push('A valid email address is required.');
    }

    // Phone validation (accept digits, +, -, spaces, parens; at least 7 digits)
    if (!phone || typeof phone !== 'string') {
      errors.push('Phone or WhatsApp number is required.');
    } else {
      const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
      if (cleanPhoneDigits.length < 7 || cleanPhoneDigits.length > 15) {
        errors.push('Please enter a valid phone or WhatsApp number (7-15 digits).');
      }
    }

    if (!service || typeof service !== 'string' || service.trim().length === 0) {
      errors.push('Please select a required engineering service category.');
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Project scope or message is required (minimum 10 characters).');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please review the highlighted errors.',
        errors
      });
    }

    // Sanitized payload
    const sanitizedInquiry = {
      name: sanitizeInput(name),
      company: company ? sanitizeInput(company) : '',
      email: validator.normalizeEmail(email.trim()) || email.trim(),
      phone: sanitizeInput(phone),
      service: sanitizeInput(service),
      message: sanitizeInput(message),
      drawingNote: drawingNote ? sanitizeInput(drawingNote) : ''
    };

    const referenceId = `HOE-${Date.now().toString(36).toUpperCase()}`;

    // Persist to database
    db.addInquiry({
      referenceId,
      name: sanitizedInquiry.name,
      company: sanitizedInquiry.company,
      email: sanitizedInquiry.email,
      phone: sanitizedInquiry.phone,
      service: sanitizedInquiry.service,
      message: sanitizedInquiry.message,
      drawingNote: sanitizedInquiry.drawingNote
    });

    // Dispatch email alert asynchronously
    await sendInquiryNotification({ ...sanitizedInquiry, referenceId });

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully. Our engineering team will review your specifications and respond shortly.',
      referenceId
    });
  } catch (error) {
    console.error('[ContactController] Error processing inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while processing your request. Please contact us directly via WhatsApp or phone.',
      errors: ['Internal server error. Please try again later.']
    });
  }
};

module.exports = {
  submitContactInquiry
};
