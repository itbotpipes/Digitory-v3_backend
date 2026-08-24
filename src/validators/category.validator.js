const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').optional().trim(),
];

exports.updateCategoryValidator = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('slug').optional().trim(),
];
