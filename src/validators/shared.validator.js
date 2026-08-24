const { body, query } = require('express-validator');

exports.createTestimonialValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('quote').trim().notEmpty().withMessage('Quote is required'),
  body('designation').optional().trim(),
  body('company').optional().trim(),
  body('image').optional().trim(),
  body('status').optional().isIn(['Draft', 'Published']),
];

exports.updateTestimonialValidator = [
  body('name').optional().trim().notEmpty(),
  body('quote').optional().trim().notEmpty(),
  body('status').optional().isIn(['Draft', 'Published']),
];

exports.createFAQValidator = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
  body('category').optional().trim(),
  body('status').optional().isIn(['Draft', 'Published']),
];

exports.createContactMessageValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('businessName').trim().notEmpty().withMessage('Business name is required'),
  body('category').optional().trim(),
  body('purpose').optional().trim(),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

exports.createDemoRequestValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('businessName').trim().notEmpty().withMessage('Business name is required'),
  body('category').optional().trim(),
  body('purpose').optional().trim(),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

exports.updateStatusValidator = [
  body('status').notEmpty().withMessage('Status is required'),
];

exports.paginateValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
