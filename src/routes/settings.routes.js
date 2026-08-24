const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { updateSettingsValidator } = require('../validators/settings.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public route for frontend
router.get('/', asyncHandler(settingsController.getSettings));

// Admin route
router.put('/', authenticate, updateSettingsValidator, validate, asyncHandler(settingsController.updateSettings));

module.exports = router;
