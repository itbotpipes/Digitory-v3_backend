const { body, query } = require('express-validator');

exports.createUserValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('roleId').notEmpty().isMongoId().withMessage('Valid role ID is required'),
];

exports.updateUserValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('roleId').optional().isMongoId().withMessage('Valid role ID is required'),
];

exports.updateStatusValidator = [
  body('status')
    .isIn(['Active', 'Inactive', 'Suspended'])
    .withMessage('Status must be Active, Inactive, or Suspended'),
];

exports.getUsersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('status').optional().trim(),
  query('role').optional().trim(),
];
