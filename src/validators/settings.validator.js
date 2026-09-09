const { body } = require('express-validator');

exports.updateSettingsValidator = [
  body('branding.logo').optional().trim(),
  body('branding.logoWhite').optional().trim(),
  body('branding.favicon').optional().trim(),
  body('branding.companyName').optional().trim(),
  body('branding.siteTitle').optional().trim(),
  body('contactInformation.email').optional().isEmail(),
  body('contactInformation.phone').optional().trim(),
  body('contactInformation.address').optional().trim(),
  body('socialLinks').optional().isArray(),
  body('defaultSeo').optional().isObject(),
  body('analytics').optional().isObject(),
];
