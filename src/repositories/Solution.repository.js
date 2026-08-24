const Solution = require('../models/Solution.model');

class SolutionRepository {
  async findById(id) {
    return await Solution.findOne({ _id: id });
  }

  async findBySlug(slug) {
    return await Solution.findOne({ slug });
  }

  async create(data) {
    return await Solution.create(data);
  }

  async update(id, updateData) {
    return await Solution.findOneAndUpdate({ _id: id }, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Solution.findByIdAndDelete(id);
  }

  async countDocuments(filters = {}) {
    return await Solution.countDocuments(filters);
  }

  async paginate(page = 1, limit = 10, filters = {}, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      Solution.find(filters).skip(skip).limit(limit).sort(sort),
      Solution.countDocuments(filters)
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

module.exports = new SolutionRepository();
