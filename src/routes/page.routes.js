const express = require('express');
const pageController = require('../controllers/page.controller');
const { createPageValidator, updatePageValidator, getPagesValidator } = require('../validators/page.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Custom middleware to optionally authenticate
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return authenticate(req, res, next);
  }
  next();
};

// Public endpoints (or lightly authenticated)
router.get('/', optionalAuth, getPagesValidator, validate, asyncHandler(pageController.getPages));
router.get('/slug/:slug', optionalAuth, asyncHandler(pageController.getPageBySlug));
router.get('/:id', optionalAuth, asyncHandler(pageController.getPageById));

// Admin routes
router.use(authenticate);

router.post('/', createPageValidator, validate, asyncHandler(pageController.createPage));

router.route('/:id')
  .put(updatePageValidator, validate, asyncHandler(pageController.updatePage))
  .delete(asyncHandler(pageController.deletePage));

router.route('/:id/publish')
  .patch(asyncHandler(pageController.publishPage));

router.route('/:id/unpublish')
  .patch(asyncHandler(pageController.unpublishPage));

module.exports = router;
