const express = require('express');
const updateController = require('../controllers/update.controller');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public endpoints
router.get('/', updateController.getAllUpdates);
router.get('/:id', updateController.getUpdateById);

// Admin-only endpoints
router.use(authenticate);
router.post('/', updateController.createUpdate);
router.put('/:id', updateController.updateUpdate);
router.delete('/:id', updateController.deleteUpdate);

module.exports = router;
