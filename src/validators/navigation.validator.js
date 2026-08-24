const { body } = require('express-validator');

exports.createNavigationValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('location').isIn(['header', 'footer']).withMessage('Location must be header or footer'),
  body('items').optional().isArray(),
];

exports.updateNavigationValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('location').optional().isIn(['header', 'footer']).withMessage('Location must be header or footer'),
  body('items').optional().isArray(),
];
