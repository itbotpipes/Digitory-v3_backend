const ContactMessage = require('../models/ContactMessage.model');

class ContactMessageRepository {
  async findById(id) { return await ContactMessage.findById(id); }
  async create(data) { return await ContactMessage.create(data); }
  async update(id, data) { return await ContactMessage.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  async delete(id) { return await ContactMessage.findByIdAndDelete(id); }
  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      ContactMessage.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      ContactMessage.countDocuments(filters)
    ]);
    return { docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = new ContactMessageRepository();
