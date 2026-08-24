const express = require('express');
const postController = require('../controllers/post.controller');
const { createPostValidator, updatePostValidator, getPostsValidator } = require('../validators/post.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Custom middleware to optionally authenticate (for public vs admin fetching)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return authenticate(req, res, next);
  }
  next();
};

// Public endpoints (or lightly authenticated)
router.get('/', optionalAuth, getPostsValidator, validate, asyncHandler(postController.getPosts));
router.get('/:idOrSlug', asyncHandler(postController.getPost));

// Admin routes
router.use(authenticate);
const authorize = require('../middlewares/authorize');
router.use(authorize('manage_blogs'));

router.post('/', createPostValidator, validate, asyncHandler(postController.createPost));
router.put('/:id', updatePostValidator, validate, asyncHandler(postController.updatePost));
router.patch('/:id/publish', asyncHandler(postController.publishPost));
router.patch('/:id/unpublish', asyncHandler(postController.unpublishPost));
router.delete('/:id', asyncHandler(postController.deletePost));

module.exports = router;
