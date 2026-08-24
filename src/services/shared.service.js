const testimonialRepository = require('../repositories/Testimonial.repository');
const faqRepository = require('../repositories/FAQ.repository');
const contactMessageRepository = require('../repositories/ContactMessage.repository');
const demoRequestRepository = require('../repositories/DemoRequest.repository');
const ApiError = require('../utils/ApiError');

class GenericService {
  constructor(repository, entityName) {
    this.repo = repository;
    this.entityName = entityName;
  }

  async create(data) {
    return await this.repo.create(data);
  }

  async getAll(page, limit, search, status, startDate, endDate) {
    const filters = {};
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      filters.status = status;
    }
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    return await this.repo.paginate(page, limit, filters);
  }

  async getById(id) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new ApiError(404, `${this.entityName} not found`);
    return doc;
  }

  async update(id, updateData) {
    const doc = await this.repo.update(id, updateData);
    if (!doc) throw new ApiError(404, `${this.entityName} not found`);
    return doc;
  }

  async delete(id) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new ApiError(404, `${this.entityName} not found`);
    await this.repo.delete(id);
    return true;
  }
}

exports.testimonialService = new GenericService(testimonialRepository, 'Testimonial');
exports.faqService = new GenericService(faqRepository, 'FAQ');
exports.contactMessageService = new GenericService(contactMessageRepository, 'Contact Message');
exports.demoRequestService = new GenericService(demoRequestRepository, 'Demo Request');
