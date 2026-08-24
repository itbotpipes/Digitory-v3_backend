const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Helper to optionally get user ID from authorization header
const getUserIdFromHeader = (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      return decoded.id;
    }
  } catch (err) {}
  return null;
};

// POST /api/comments
exports.createComment = asyncHandler(async (req, res) => {
  const { post, name, text, parentId } = req.body;

  if (!post || !name || !text) {
    return res.status(400).json(new ApiResponse(400, null, 'Post ID, name, and text are required'));
  }

  // Verify post exists
  const postExists = await Post.findById(post);
  if (!postExists) {
    return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
  }

  // Determine user ID if logged in
  const userId = getUserIdFromHeader(req);

  const commentData = {
    post,
    name,
    text,
    user: userId || null,
    parentId: parentId || null
  };

  const comment = await Comment.create(commentData);

  // Return comment populated with user
  const populated = await Comment.findById(comment._id)
    .populate('user', 'name email')
    .lean();

  return res.status(201).json(new ApiResponse(201, populated, 'Comment posted successfully'));
});

// PUT /api/comments/:id
exports.editComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json(new ApiResponse(400, null, 'Comment text is required'));
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
  }

  // Verify ownership
  if (!req.user || !comment.user || comment.user.toString() !== req.user.id) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized to edit this comment'));
  }

  comment.text = text;
  comment.isEdited = true;
  await comment.save();

  const populated = await Comment.findById(comment._id)
    .populate('user', 'name email')
    .lean();

  return res.status(200).json(new ApiResponse(200, populated, 'Comment edited successfully'));
});

// POST /api/comments/:id/report
exports.reportComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json(new ApiResponse(400, null, 'Reason for reporting is required'));
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
  }

  const userId = req.user.id;
  const alreadyReported = comment.reports.some(r => r.user && r.user.toString() === userId);
  if (alreadyReported) {
    return res.status(400).json(new ApiResponse(400, null, 'You have already reported this comment'));
  }

  comment.reports.push({
    user: userId,
    reason: reason.trim()
  });

  comment.reportsCount = comment.reports.length;
  comment.isReported = true;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, 'Comment reported successfully'));
});

// POST /api/comments/:id/unreport
exports.unreportComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
  }

  const userId = req.user.id;
  const initialLength = comment.reports.length;
  comment.reports = comment.reports.filter(r => r.user && r.user.toString() !== userId);

  if (comment.reports.length === initialLength) {
    return res.status(400).json(new ApiResponse(400, null, 'You have not reported this comment'));
  }

  comment.reportsCount = comment.reports.length;
  comment.isReported = comment.reports.length > 0;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, 'Report removed successfully'));
});

// POST /api/comments/:id/like
exports.likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const guestClientId = req.body.guestClientId || req.headers['x-guest-client-id'];

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
  }

  const userId = req.user ? req.user.id : guestClientId;
  if (!userId) {
    return res.status(400).json(new ApiResponse(400, null, 'User ID or Guest Client ID is required to like a comment'));
  }

  const likeIndex = comment.likes.indexOf(userId.toString());
  if (likeIndex > -1) {
    comment.likes.splice(likeIndex, 1);
  } else {
    comment.likes.push(userId.toString());
  }

  await comment.save();

  const populated = await Comment.findById(comment._id)
    .populate('user', 'name email')
    .lean();

  return res.status(200).json(new ApiResponse(200, populated, 'Comment like toggled successfully'));
});

// GET /api/comments/post/:postId
exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Retrieve all comments for this post
  const comments = await Comment.find({ post: postId, isDeleted: { $ne: true }, isHidden: { $ne: true } })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});

// GET /api/comments (Admin & Filter by User / Name)
exports.getAllComments = asyncHandler(async (req, res) => {
  const { user, name } = req.query;
  const filter = { isDeleted: { $ne: true } };

  if (user) {
    filter.user = user;
  }
  if (name) {
    filter.name = { $regex: name, $options: 'i' }; // Case-insensitive filter
  }

  const comments = await Comment.find(filter)
    .populate('post', 'title slug')
    .populate('user', 'name email')
    .populate('reports.user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, comments, 'All comments retrieved successfully'));
});

// DELETE /api/comments/:id (Admin or Owner)
exports.deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
  }

  // Check authorization: must be admin or comment owner
  const Role = require('../models/Role.model');
  let isAuthorized = false;
  if (req.user) {
    if (comment.user && comment.user.toString() === req.user.id) {
      isAuthorized = true;
    } else {
      const role = await Role.findById(req.user.roleId);
      if (role && (role.permissions.includes('*') || role.name === 'Admin' || role.permissions.includes('manage_comments'))) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized to delete this comment'));
  }

  comment.isDeleted = true;
  await comment.save();

  // Cascade soft-delete to any child replies
  await Comment.updateMany({ parentId: id }, { $set: { isDeleted: true } });

  return res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'));
});

// PATCH /api/comments/:id/toggle-hide
exports.toggleHideComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
  }

  // Verify caller is admin
  const Role = require('../models/Role.model');
  let isAdmin = false;
  if (req.user) {
    const role = await Role.findById(req.user.roleId);
    if (role && (role.permissions.includes('*') || role.name === 'Admin' || role.permissions.includes('manage_comments'))) {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized to hide comments'));
  }

  comment.isHidden = !comment.isHidden;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, `Comment updated successfully`));
});
