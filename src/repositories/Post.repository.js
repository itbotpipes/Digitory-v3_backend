const Post = require('../models/Post.model');

class PostRepository {
  async findById(id) {
    return await Post.findOne({ _id: id, isDeleted: false }).populate('category author');
  }

  async findBySlug(slug) {
    return await Post.findOne({ slug, isDeleted: false }).populate('category author');
  }

  async create(data) {
    return await Post.create(data);
  }

  async update(id, updateData) {
    return await Post.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true, runValidators: true });
  }

  async softDelete(id) {
    return await Post.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async countByCategory(categoryId) {
    return await Post.countDocuments({ category: categoryId, isDeleted: false });
  }

  async countDocuments(filters = {}) {
    return await Post.countDocuments({ ...filters, isDeleted: false });
  }

  async paginate(page = 1, limit = 10, filters = {}, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit;
    const finalFilters = { ...filters, isDeleted: false };
    
    const [docs, total] = await Promise.all([
      Post.find(finalFilters).populate('category author').skip(skip).limit(limit).sort(sort),
      Post.countDocuments(finalFilters)
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

module.exports = new PostRepository();
