const FAQ = require('../models/FAQ.model');

class FAQRepository {
  async findById(id) { return await FAQ.findById(id); }
  async create(data) { return await FAQ.create(data); }
  async update(id, data) { return await FAQ.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  async delete(id) { return await FAQ.findByIdAndDelete(id); }
  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      FAQ.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      FAQ.countDocuments(filters)
    ]);
    return { docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = new FAQRepository();
