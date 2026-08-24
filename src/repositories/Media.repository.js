const Media = require('../models/Media.model');

class MediaRepository {
  async findById(id) {
    return await Media.findById(id);
  }

  async create(mediaData) {
    return await Media.create(mediaData);
  }

  async delete(id) {
    return await Media.findByIdAndDelete(id);
  }

  async paginate(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      Media.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Media.countDocuments(filters)
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

module.exports = new MediaRepository();
