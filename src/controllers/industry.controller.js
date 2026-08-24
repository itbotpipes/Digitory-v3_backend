const industryService = require('../services/industry.service');
const ApiResponse = require('../utils/ApiResponse');

class IndustryController {
  async createIndustry(req, res) {
    const industry = await industryService.createIndustry(req.body);
    res.status(201).json(new ApiResponse(201, industry, 'Industry created successfully'));
  }

  async getIndustries(req, res) {
    const { page = 1, limit = 10, search, sort } = req.query;
    const result = await industryService.getIndustries(page, limit, search, sort);
    res.status(200).json(new ApiResponse(200, result, 'Industries fetched successfully'));
  }

  async getIndustry(req, res) {
    const industry = await industryService.getIndustryByIdOrSlug(req.params.idOrSlug);
    res.status(200).json(new ApiResponse(200, industry, 'Industry fetched successfully'));
  }

  async updateIndustry(req, res) {
    const industry = await industryService.updateIndustry(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, industry, 'Industry updated successfully'));
  }

  async deleteIndustry(req, res) {
    await industryService.deleteIndustry(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Industry deleted successfully'));
  }
}

module.exports = new IndustryController();
