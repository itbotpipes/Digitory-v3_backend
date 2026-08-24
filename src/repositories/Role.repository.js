const Role = require('../models/Role.model');

class RoleRepository {
  /**
   * Find a role by its ID
   */
  async findById(id) {
    return await Role.findById(id);
  }

  /**
   * Find a role by name
   */
  async findByName(name) {
    return await Role.findOne({ name });
  }

  /**
   * Find all roles
   */
  async findAll() {
    return await Role.find().sort({ createdAt: 1 });
  }

  /**
   * Create a new role
   */
  async create(roleData) {
    return await Role.create(roleData);
  }

  /**
   * Update an existing role
   */
  async update(id, updateData) {
    return await Role.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * Delete a role
   */
  async delete(id) {
    return await Role.findByIdAndDelete(id);
  }
}

module.exports = new RoleRepository();
