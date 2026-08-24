const express = require('express');
const roleController = require('../controllers/role.controller');
const { createRoleValidator, updateRoleValidator } = require('../validators/role.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(authenticate);
router.use(authorize('manage_users')); // Manage users & roles permission

router.route('/')
  .get(asyncHandler(roleController.getRoles))
  .post(createRoleValidator, validate, asyncHandler(roleController.createRole));

router.route('/:id')
  .put(updateRoleValidator, validate, asyncHandler(roleController.updateRole))
  .delete(asyncHandler(roleController.deleteRole));

module.exports = router;
