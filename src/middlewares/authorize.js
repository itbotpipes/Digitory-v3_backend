const ApiError = require('../utils/ApiError');
const Role = require('../models/Role.model');

const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        return next(new ApiError(401, 'Not authenticated', [{ field: 'token', message: 'No role ID found' }]));
      }

      const role = await Role.findById(req.user.roleId);
      if (!role) {
        return next(new ApiError(403, 'Forbidden', [{ field: 'permissions', message: 'Role not found' }]));
      }

      // Admin can do everything ('*' permission)
      if (role.permissions.includes('*') || role.name === 'Admin') {
        return next();
      }

      if (!role.permissions.includes(requiredPermission)) {
        return next(new ApiError(403, 'Forbidden', [{ field: 'permissions', message: `Missing required permission: ${requiredPermission}` }]));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorize;
