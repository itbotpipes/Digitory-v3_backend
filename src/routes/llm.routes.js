const express = require('express');
const llmController = require('../controllers/llm.controller');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', llmController.getLlmTxt);
router.post('/', llmController.saveLlmTxt);

module.exports = router;
