const Role = require('../models/Role.model');
const User = require('../models/User.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, roles, 'Roles retrieved successfully'));
});

exports.createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new ApiError(400, 'Role name already exists', [{ field: 'name', message: 'Already exists' }]);
  }

  const role = await Role.create({ name, permissions });
  res.status(201).json(new ApiResponse(201, role, 'Role created successfully'));
});

exports.updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // Prevent changing standard role names to protect admin stability
  if (role.name === 'Admin' && name && name !== 'Admin') {
    throw new ApiError(400, 'Cannot rename default Admin role');
  }

  if (name) {
    const existingRole = await Role.findOne({ name, _id: { $ne: id } });
    if (existingRole) {
      throw new ApiError(400, 'Role name already exists', [{ field: 'name', message: 'Already exists' }]);
    }
    role.name = name;
  }

  if (permissions) {
    role.permissions = permissions;
  }

  await role.save();
  res.status(200).json(new ApiResponse(200, role, 'Role updated successfully'));
});

exports.deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  if (role.name === 'Admin') {
    throw new ApiError(400, 'Cannot delete Admin role');
  }

  // Check if any user is currently assigned this role
  const usersWithRole = await User.countDocuments({ roleId: id });
  if (usersWithRole > 0) {
    throw new ApiError(400, 'Cannot delete role that is assigned to active users', [
      { field: 'roleId', message: `Assigned to ${usersWithRole} users` }
    ]);
  }

  await Role.findByIdAndDelete(id);
  res.status(200).json(new ApiResponse(200, null, 'Role deleted successfully'));
});
