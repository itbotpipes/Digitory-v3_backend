const categoryRepository = require('../repositories/Category.repository');
const postRepository = require('../repositories/Post.repository');
const ApiError = require('../utils/ApiError');

class CategoryService {
  async createCategory(data) {
    const existingName = await categoryRepository.findByName(data.name);
    if (existingName) throw new ApiError(400, 'Category name already exists');
    
    if (data.slug) {
      const existingSlug = await categoryRepository.findBySlug(data.slug);
      if (existingSlug) throw new ApiError(400, 'Category slug already exists');
    }

    return await categoryRepository.create(data);
  }

  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  async updateCategory(id, updateData) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new ApiError(404, 'Category not found');

    if (updateData.name && updateData.name !== category.name) {
      const existingName = await categoryRepository.findByName(updateData.name);
      if (existingName) throw new ApiError(400, 'Category name already exists');
    }

    if (updateData.slug && updateData.slug !== category.slug) {
      const existingSlug = await categoryRepository.findBySlug(updateData.slug);
      if (existingSlug) throw new ApiError(400, 'Category slug already exists');
    }

    Object.assign(category, updateData);
    await category.save();
    return category;
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new ApiError(404, 'Category not found');

    const postsCount = await postRepository.countByCategory(id);
    if (postsCount > 0) {
      throw new ApiError(400, `Cannot delete category. It is assigned to ${postsCount} post(s).`);
    }

    await categoryRepository.delete(id);
    return true;
  }
}

module.exports = new CategoryService();
