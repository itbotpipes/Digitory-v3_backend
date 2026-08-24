const express = require('express');
const robotsController = require('../controllers/robots.controller');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', robotsController.getRobotsTxt);
router.post('/', robotsController.saveRobotsTxt);

module.exports = router;
