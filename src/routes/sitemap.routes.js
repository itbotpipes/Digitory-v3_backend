const express = require('express');
const sitemapController = require('../controllers/sitemap.controller');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/info', sitemapController.getSitemapInfo);
router.post('/generate', sitemapController.generateSitemap);

module.exports = router;
