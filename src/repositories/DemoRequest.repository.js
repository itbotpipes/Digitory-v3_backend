const DemoRequest = require('../models/DemoRequest.model');

class DemoRequestRepository {
  async findById(id) { return await DemoRequest.findById(id); }
  async create(data) { return await DemoRequest.create(data); }
  async update(id, data) { return await DemoRequest.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  async delete(id) { return await DemoRequest.findByIdAndDelete(id); }
  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      DemoRequest.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      DemoRequest.countDocuments(filters)
    ]);
    return { docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = new DemoRequestRepository();
