const Category = require('../models/Category.model');

class CategoryRepository {
  async findById(id) {
    return await Category.findById(id);
  }

  async findByName(name) {
    return await Category.findOne({ name });
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug });
  }

  async create(data) {
    return await Category.create(data);
  }

  async update(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }

  async findAll() {
    return await Category.find().sort({ name: 1 });
  }
}

module.exports = new CategoryRepository();
