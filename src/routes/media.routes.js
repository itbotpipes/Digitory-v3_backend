const express = require('express');
const mediaController = require('../controllers/media.controller');
const { getMediaValidator } = require('../validators/media.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

const router = express.Router();

router.use(authenticate);

router.route('/')
  .get(getMediaValidator, validate, asyncHandler(mediaController.getMedia))
  .post(upload.single('file'), asyncHandler(mediaController.uploadMedia));

router.route('/:id')
  .delete(asyncHandler(mediaController.deleteMedia));

module.exports = router;
