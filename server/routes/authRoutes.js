const express = require('express');
const { login, getMe, changePassword } = require('../controllers/authController');
const { requireAdminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAdminAuth, getMe);
router.post('/change-password', requireAdminAuth, changePassword);

module.exports = router;
