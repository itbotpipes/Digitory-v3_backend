const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  async createUser(req, res) {
    const user = await userService.createUser(req.body);
    res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
  }

  async getUsers(req, res) {
    const { page = 1, limit = 10, search, status, role } = req.query;
    
    let roleIds = [];
    if (role) {
      const roleNames = role.split(',');
      const roles = await require('../models/Role.model').find({ name: { $in: roleNames } });
      roleIds = roles.map(r => r._id);
    }

    const result = await userService.getUsers(page, limit, search, status, roleIds.length > 0 ? { $in: roleIds } : undefined);
    res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'));
  }

  async getRoles(req, res) {
    const roles = await userService.getRoles();
    res.status(200).json(new ApiResponse(200, roles, 'Roles fetched successfully'));
  }

  async getUserById(req, res) {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
  }

  async updateUser(req, res) {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
  }

  async updateStatus(req, res) {
    const { status } = req.body;
    const user = await userService.updateStatus(req.params.id, status);
    res.status(200).json(new ApiResponse(200, user, 'User status updated successfully'));
  }

  async deleteUser(req, res) {
    await userService.deleteUser(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
  }
}

module.exports = new UserController();
