const { testimonialService, faqService, contactMessageService, demoRequestService } = require('../services/shared.service');
const ApiResponse = require('../utils/ApiResponse');

const createController = (service) => {
  return {
    create: async (req, res) => {
      const doc = await service.create(req.body);
      res.status(201).json(new ApiResponse(201, doc, `${service.entityName} created successfully`));
    },
    getAll: async (req, res) => {
      const { page = 1, limit = 10, search, status, startDate, endDate } = req.query;
      const result = await service.getAll(page, limit, search, status, startDate, endDate);
      res.status(200).json(new ApiResponse(200, result, `${service.entityName}s fetched successfully`));
    },
    getById: async (req, res) => {
      const doc = await service.getById(req.params.id);
      res.status(200).json(new ApiResponse(200, doc, `${service.entityName} fetched successfully`));
    },
    update: async (req, res) => {
      const doc = await service.update(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, doc, `${service.entityName} updated successfully`));
    },
    delete: async (req, res) => {
      await service.delete(req.params.id);
      res.status(200).json(new ApiResponse(200, null, `${service.entityName} deleted successfully`));
    }
  };
};

exports.testimonialController = createController(testimonialService);
exports.faqController = createController(faqService);
exports.contactMessageController = createController(contactMessageService);
exports.demoRequestController = createController(demoRequestService);
