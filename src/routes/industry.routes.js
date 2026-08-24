const express = require('express');
const industryController = require('../controllers/industry.controller');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Public endpoints
router.get('/', asyncHandler(industryController.getIndustries));
router.get('/:idOrSlug', asyncHandler(industryController.getIndustry));

// Admin routes (protected)
router.use(authenticate);
router.use(authorize('manage_industries'));

router.post('/', asyncHandler(industryController.createIndustry));
router.put('/:id', asyncHandler(industryController.updateIndustry));
router.delete('/:id', asyncHandler(industryController.deleteIndustry));

module.exports = router;
