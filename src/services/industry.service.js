const industryRepository = require('../repositories/Industry.repository');
const ApiError = require('../utils/ApiError');

class IndustryService {
  async createIndustry(data) {
    if (data.slug) {
      const existing = await industryRepository.findBySlug(data.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }
    return await industryRepository.create(data);
  }

  async updateIndustry(id, updateData) {
    const industry = await industryRepository.findById(id);
    if (!industry) throw new ApiError(404, 'Industry not found');

    if (updateData.slug && updateData.slug !== industry.slug) {
      const existing = await industryRepository.findBySlug(updateData.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }

    Object.assign(industry, updateData);
    await industry.save();
    return industry;
  }

  async getIndustries(page, limit, search, sortString) {
    const filters = {};

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sort = { createdAt: -1 };
    if (sortString) {
      const sortField = sortString.replace('-', '');
      const sortOrder = sortString.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    return await industryRepository.paginate(page, limit, filters, sort);
  }

  async getIndustryByIdOrSlug(identifier) {
    let industry;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      industry = await industryRepository.findById(identifier);
    } else {
      industry = await industryRepository.findBySlug(identifier);
    }
    if (!industry) throw new ApiError(404, 'Industry not found');
    return industry;
  }

  async deleteIndustry(id) {
    const industry = await industryRepository.findById(id);
    if (!industry) throw new ApiError(404, 'Industry not found');
    await industryRepository.delete(id);
    return true;
  }
}

module.exports = new IndustryService();
