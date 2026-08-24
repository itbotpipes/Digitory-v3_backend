const express = require('express');
const userController = require('../controllers/user.controller');
const { 
  createUserValidator, 
  updateUserValidator, 
  updateStatusValidator, 
  getUsersValidator 
} = require('../validators/user.validator');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Public: get all users who can author blogs (have manage_blogs permission)
router.get('/authors', asyncHandler(async (req, res) => {
  const User = require('../models/User.model');
  const Role = require('../models/Role.model');
  const ApiResponse = require('../utils/ApiResponse');
  const blogRoles = await Role.find({ permissions: { $in: ['manage_blogs', '*'] } }).select('_id');
  const roleIds = blogRoles.map(r => r._id);
  const authors = await User.find({ roleId: { $in: roleIds } }).select('_id name email').sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, authors, 'Authors fetched successfully'));
}));

// All user routes are protected
router.use(authenticate);
const authorize = require('../middlewares/authorize');
router.use(authorize('manage_users'));

router.route('/')
  .get(getUsersValidator, validate, asyncHandler(userController.getUsers))
  .post(createUserValidator, validate, asyncHandler(userController.createUser));

router.route('/roles')
  .get(asyncHandler(userController.getRoles));

router.route('/:id')
  .get(asyncHandler(userController.getUserById))
  .put(updateUserValidator, validate, asyncHandler(userController.updateUser))
  .delete(asyncHandler(userController.deleteUser));

router.route('/:id/status')
  .patch(updateStatusValidator, validate, asyncHandler(userController.updateStatus));

module.exports = router;
