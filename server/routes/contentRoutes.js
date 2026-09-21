const express = require('express');
const { getAllPublicContent } = require('../controllers/publicContentController');
const { getPublicPage } = require('../controllers/pageController');
const { getPublicPosts, getPublicPostBySlug } = require('../controllers/blogController');
const { getPublicSchema } = require('../controllers/schemaController');

const router = express.Router();

router.get('/all', getAllPublicContent);
router.get('/page', getPublicPage);
router.get('/page/*', getPublicPage);

// Public Blog Routes
router.get('/posts', getPublicPosts);
router.get('/posts/:slug', getPublicPostBySlug);

// Public Schema.org Route
router.get('/schema', getPublicSchema);

module.exports = router;
