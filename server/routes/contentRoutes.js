const express = require('express');
const { getAllPublicContent } = require('../controllers/publicContentController');

const router = express.Router();

router.get('/all', getAllPublicContent);

module.exports = router;
