const User = require('../models/User.model');

class UserRepository {
  /**
   * Find a user by their ID
   */
  async findById(id) {
    return await User.findById(id).populate('roleId');
  }

  /**
   * Find a user by their email address
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+password'); // Must explicitly select password due to select:false
    }
    return await query.populate('roleId');
  }

  /**
   * Create a new user
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Update an existing user
   */
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * Delete a user
   */
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  /**
   * Paginate users
   */
  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      User.find(filters).skip(skip).limit(limit).populate('roleId').sort({ createdAt: -1 }),
      User.countDocuments(filters)
    ]);

    return {
      docs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = new UserRepository();
