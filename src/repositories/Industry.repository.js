const Industry = require('../models/Industry.model');

class IndustryRepository {
  async findById(id) {
    return await Industry.findOne({ _id: id });
  }

  async findBySlug(slug) {
    return await Industry.findOne({ slug });
  }

  async create(data) {
    return await Industry.create(data);
  }

  async update(id, updateData) {
    return await Industry.findOneAndUpdate({ _id: id }, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Industry.findByIdAndDelete(id);
  }

  async countDocuments(filters = {}) {
    return await Industry.countDocuments(filters);
  }

  async paginate(page = 1, limit = 10, filters = {}, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      Industry.find(filters).skip(skip).limit(limit).sort(sort),
      Industry.countDocuments(filters)
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

module.exports = new IndustryRepository();
