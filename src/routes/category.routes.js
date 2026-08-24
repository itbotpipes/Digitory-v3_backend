const express = require('express');
const categoryController = require('../controllers/category.controller');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/category.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public route for frontend
router.get('/', asyncHandler(categoryController.getAllCategories));
router.get('/:id', asyncHandler(categoryController.getCategoryById));

// Admin routes
router.use(authenticate);

router.post('/', createCategoryValidator, validate, asyncHandler(categoryController.createCategory));
router.put('/:id', updateCategoryValidator, validate, asyncHandler(categoryController.updateCategory));
router.delete('/:id', asyncHandler(categoryController.deleteCategory));

module.exports = router;
