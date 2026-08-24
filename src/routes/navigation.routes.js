const express = require('express');
const navigationController = require('../controllers/navigation.controller');
const { createNavigationValidator, updateNavigationValidator } = require('../validators/navigation.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public route to get navigation for frontend
router.get('/location/:location', asyncHandler(navigationController.getNavigationByLocation));

// Admin routes
router.use(authenticate);

router.route('/')
  .get(asyncHandler(navigationController.getAllNavigation))
  .post(createNavigationValidator, validate, asyncHandler(navigationController.createNavigation));

router.route('/:id')
  .put(updateNavigationValidator, validate, asyncHandler(navigationController.updateNavigation))
  .delete(asyncHandler(navigationController.deleteNavigation));

module.exports = router;
