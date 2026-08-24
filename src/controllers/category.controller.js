const categoryService = require('../services/category.service');
const ApiResponse = require('../utils/ApiResponse');

class CategoryController {
  async createCategory(req, res) {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
  }

  async getAllCategories(req, res) {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  }

  async getCategoryById(req, res) {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(new ApiResponse(200, category, 'Category fetched successfully'));
  }

  async updateCategory(req, res) {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
  }

  async deleteCategory(req, res) {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
  }
}

module.exports = new CategoryController();
