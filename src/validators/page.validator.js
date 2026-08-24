const { body, query } = require('express-validator');

exports.createPageValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('slug').optional().trim(),
  body('status').optional().isIn(['Draft', 'Published']).withMessage('Invalid status'),
  body('seo').optional().isObject(),
  body('sections').optional().isArray(),
];

exports.updatePageValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('slug').optional().trim(),
  body('status').optional().isIn(['Draft', 'Published']).withMessage('Invalid status'),
  body('seo').optional().isObject(),
  body('sections').optional().isArray(),
];

exports.getPagesValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('status').optional().trim(),
];
