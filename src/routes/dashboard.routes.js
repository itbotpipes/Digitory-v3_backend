const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/stats', asyncHandler(dashboardController.getDashboardStats));

module.exports = router;
