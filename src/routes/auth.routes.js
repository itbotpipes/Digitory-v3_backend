const express = require('express');
const authController = require('../controllers/auth.controller');
const { loginValidator, signupValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public route
router.post('/login', loginValidator, validate, asyncHandler(authController.login));
router.post('/signup', signupValidator, validate, asyncHandler(authController.signup));

// Protected route
router.get('/me', authenticate, asyncHandler(authController.getMe));

// Mock google login route
router.post('/google-mock', asyncHandler(authController.googleMock));

// Real google login route
router.post('/google', asyncHandler(authController.google));

module.exports = router;
