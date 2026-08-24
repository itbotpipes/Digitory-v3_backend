const Page = require('../models/Page.model');

class PageRepository {
  async findById(id) {
    return await Page.findById(id);
  }

  async findBySlug(slug) {
    return await Page.findOne({ slug });
  }

  async create(pageData) {
    return await Page.create(pageData);
  }

  async update(id, updateData) {
    return await Page.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Page.findByIdAndDelete(id);
  }

  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      Page.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Page.countDocuments(filters)
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

module.exports = new PageRepository();
