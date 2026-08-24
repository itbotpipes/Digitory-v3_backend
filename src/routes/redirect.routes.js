const express = require('express');
const redirectController = require('../controllers/redirect.controller');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// For frontend middleware use (if frontend queries backend for redirects directly on load)
router.get('/public', redirectController.getRedirects);

// Admin routes
router.use(authenticate);

router.get('/', redirectController.getRedirects);
router.post('/', redirectController.createRedirect);
router.put('/:id', redirectController.updateRedirect);
router.delete('/:id', redirectController.deleteRedirect);

module.exports = router;
