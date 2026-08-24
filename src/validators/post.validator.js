const { body, query } = require('express-validator');

exports.createPostValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('slug').optional().trim(),
  body('excerpt').optional().trim(),
  body('featuredImage').optional().trim(),
  body('category').optional({ checkFalsy: true }).isMongoId(),
  body('status').optional().isIn(['Draft', 'Published']),
  body('tags').optional().isArray(),
  body('seo').optional().isObject(),
];

exports.updatePostValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().notEmpty(),
  body('slug').optional().trim(),
  body('excerpt').optional().trim(),
  body('featuredImage').optional().trim(),
  body('category').optional({ checkFalsy: true }).custom((value) => {
    if (value === '') return true;
    if (!require('mongoose').Types.ObjectId.isValid(value)) {
      throw new Error('Category must be a valid Mongo ID');
    }
    return true;
  }),
  body('status').optional().isIn(['Draft', 'Published']),
  body('tags').optional().isArray(),
  body('seo').optional().isObject(),
];

exports.getPostsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('category').optional().isMongoId(),
  query('status').optional().isIn(['Draft', 'Published']),
  query('sort').optional().trim(),
];
