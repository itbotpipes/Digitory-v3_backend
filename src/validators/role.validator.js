const { body } = require('express-validator');

exports.createRoleValidator = [
  body('name').trim().notEmpty().withMessage('Role name is required'),
  body('permissions').isArray().withMessage('Permissions must be an array of strings'),
  body('permissions.*').trim().notEmpty().withMessage('Permission value cannot be empty'),
];

exports.updateRoleValidator = [
  body('name').optional().trim().notEmpty().withMessage('Role name cannot be empty'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array of strings'),
  body('permissions.*').optional().trim().notEmpty().withMessage('Permission value cannot be empty'),
];
