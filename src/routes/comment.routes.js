const express = require('express');
const {
  createComment,
  getCommentsByPost,
  getAllComments,
  deleteComment,
  editComment,
  reportComment,
  unreportComment,
  likeComment,
  toggleHideComment,
} = require('../controllers/comment.controller');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/', createComment);
router.get('/post/:postId', getCommentsByPost);

// Authenticated routes
router.put('/:id', authenticate, editComment);
router.delete('/:id', authenticate, deleteComment);
router.post('/:id/report', authenticate, reportComment);
router.post('/:id/unreport', authenticate, unreportComment);
router.post('/:id/like', likeComment);

// Admin routes
router.use(authenticate);
const authorize = require('../middlewares/authorize');
router.use(authorize('manage_comments'));

router.get('/', getAllComments);
router.patch('/:id/toggle-hide', toggleHideComment);

module.exports = router;
