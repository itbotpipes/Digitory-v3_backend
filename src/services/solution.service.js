const solutionRepository = require('../repositories/Solution.repository');
const ApiError = require('../utils/ApiError');

class SolutionService {
  async createSolution(data) {
    if (data.slug) {
      const existing = await solutionRepository.findBySlug(data.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }
    return await solutionRepository.create(data);
  }

  async updateSolution(id, updateData) {
    const solution = await solutionRepository.findById(id);
    if (!solution) throw new ApiError(404, 'Solution not found');

    if (updateData.slug && updateData.slug !== solution.slug) {
      const existing = await solutionRepository.findBySlug(updateData.slug);
      if (existing) throw new ApiError(400, 'Slug is already in use');
    }

    Object.assign(solution, updateData);
    await solution.save();
    return solution;
  }

  async getSolutions(page, limit, search, sortString) {
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

    return await solutionRepository.paginate(page, limit, filters, sort);
  }

  async getSolutionByIdOrSlug(identifier) {
    let solution;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      solution = await solutionRepository.findById(identifier);
    } else {
      solution = await solutionRepository.findBySlug(identifier);
    }
    if (!solution) throw new ApiError(404, 'Solution not found');
    return solution;
  }

  async deleteSolution(id) {
    const solution = await solutionRepository.findById(id);
    if (!solution) throw new ApiError(404, 'Solution not found');
    await solutionRepository.delete(id);
    return true;
  }
}

module.exports = new SolutionService();
