const { body, query } = require('express-validator');

exports.createSolutionValidator = [
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('shortLabel').trim().notEmpty().withMessage('Short label is required'),
  body('badge').optional().trim(),
  body('subtitle').optional().trim(),
  body('description').optional().trim(),
  body('ctaText').optional().trim(),
  body('trustText').optional().trim(),
  body('icon').optional().trim(),
  body('whyChoose').optional().isArray(),
  body('featuresTitle').optional().trim(),
  body('features').optional().isArray(),
  body('businessTypes').optional().isArray(),
  body('integrations').optional().isArray(),
  body('extraGrowth').optional().isObject(),
  body('extraOwnersChoice').optional().isObject(),
  body('supportItems').optional().isArray(),
  body('securityItems').optional().isArray(),
  body('ctaBlock').optional().isObject(),
  body('seo').optional().isObject(),
];

exports.updateSolutionValidator = [
  body('slug').optional().trim().notEmpty(),
  body('title').optional().trim().notEmpty(),
  body('shortLabel').optional().trim().notEmpty(),
  body('badge').optional().trim(),
  body('subtitle').optional().trim(),
  body('description').optional().trim(),
  body('ctaText').optional().trim(),
  body('trustText').optional().trim(),
  body('icon').optional().trim(),
  body('whyChoose').optional().isArray(),
  body('featuresTitle').optional().trim(),
  body('features').optional().isArray(),
  body('businessTypes').optional().isArray(),
  body('integrations').optional().isArray(),
  body('extraGrowth').optional().isObject(),
  body('extraOwnersChoice').optional().isObject(),
  body('supportItems').optional().isArray(),
  body('securityItems').optional().isArray(),
  body('ctaBlock').optional().isObject(),
  body('seo').optional().isObject(),
];

exports.getSolutionsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('sort').optional().trim(),
];
