const pageService = require('../services/page.service');
const ApiResponse = require('../utils/ApiResponse');

class PageController {
  async createPage(req, res) {
    const page = await pageService.createPage(req.body);
    res.status(201).json(new ApiResponse(201, page, 'Page created successfully'));
  }

  async getPages(req, res) {
    const { page = 1, limit = 10, search, status } = req.query;
    const result = await pageService.getPages(page, limit, search, status);
    res.status(200).json(new ApiResponse(200, result, 'Pages fetched successfully'));
  }

  async getPageById(req, res) {
    const page = await pageService.getPageById(req.params.id);
    res.status(200).json(new ApiResponse(200, page, 'Page fetched successfully'));
  }

  async getPageBySlug(req, res) {
    const page = await pageService.getPageBySlug(req.params.slug);
    res.status(200).json(new ApiResponse(200, page, 'Page fetched successfully'));
  }

  async updatePage(req, res) {
    const page = await pageService.updatePage(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, page, 'Page updated successfully'));
  }

  async publishPage(req, res) {
    const page = await pageService.publishPage(req.params.id);
    res.status(200).json(new ApiResponse(200, page, 'Page published successfully'));
  }

  async unpublishPage(req, res) {
    const page = await pageService.unpublishPage(req.params.id);
    res.status(200).json(new ApiResponse(200, page, 'Page unpublished successfully'));
  }

  async deletePage(req, res) {
    await pageService.deletePage(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Page deleted successfully'));
  }
}

module.exports = new PageController();
