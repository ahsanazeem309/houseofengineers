const express = require('express');
const { getAllPublicContent } = require('../controllers/publicContentController');
const { getPublicPage } = require('../controllers/pageController');

const router = express.Router();

router.get('/all', getAllPublicContent);
router.get('/page', getPublicPage);
router.get('/page/*', getPublicPage);

module.exports = router;
