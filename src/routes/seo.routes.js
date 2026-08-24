const express = require('express');
const seoController = require('../controllers/seo.controller');
const authenticate = require('../middlewares/auth');
// const { checkRole } = require('../middlewares/checkRole');

const router = express.Router();

// Public/Front-end endpoint
router.get('/:pageType/slug/:slug', seoController.getSeoBySlug);
router.get('/:pageType/:pageId', seoController.getSeoByPage);

// Admin routes
router.use(authenticate);

// We assume checkRole is implemented or we just use authenticate for now
// router.use(checkRole(['admin']));

router.get('/analytics', seoController.getSeoAnalytics);
router.get('/', seoController.getAllSeo);
router.post('/', seoController.saveSeo);
router.post('/bulk', seoController.bulkUpdateSeo);

module.exports = router;
