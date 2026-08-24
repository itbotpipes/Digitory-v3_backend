const solutionService = require('../services/solution.service');
const ApiResponse = require('../utils/ApiResponse');

class SolutionController {
  async createSolution(req, res) {
    const solution = await solutionService.createSolution(req.body);
    res.status(201).json(new ApiResponse(201, solution, 'Solution created successfully'));
  }

  async getSolutions(req, res) {
    const { page = 1, limit = 10, search, sort } = req.query;
    
    const result = await solutionService.getSolutions(page, limit, search, sort);
    res.status(200).json(new ApiResponse(200, result, 'Solutions fetched successfully'));
  }

  async getSolution(req, res) {
    // Can be ID or slug
    const solution = await solutionService.getSolutionByIdOrSlug(req.params.idOrSlug);
    res.status(200).json(new ApiResponse(200, solution, 'Solution fetched successfully'));
  }

  async updateSolution(req, res) {
    const solution = await solutionService.updateSolution(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, solution, 'Solution updated successfully'));
  }

  async deleteSolution(req, res) {
    await solutionService.deleteSolution(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Solution deleted successfully'));
  }
}

module.exports = new SolutionController();
