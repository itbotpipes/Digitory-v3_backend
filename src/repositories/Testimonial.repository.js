const Testimonial = require('../models/Testimonial.model');

class TestimonialRepository {
  async findById(id) { return await Testimonial.findById(id); }
  async create(data) { return await Testimonial.create(data); }
  async update(id, data) { return await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  async delete(id) { return await Testimonial.findByIdAndDelete(id); }
  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Testimonial.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Testimonial.countDocuments(filters)
    ]);
    return { docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = new TestimonialRepository();
