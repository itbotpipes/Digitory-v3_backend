const navigationRepository = require('../repositories/Navigation.repository');
const ApiError = require('../utils/ApiError');

class NavigationService {
  async createNavigation(data) {
    const existing = await navigationRepository.findByLocation(data.location);
    if (existing) {
      throw new ApiError(400, `Navigation for location '${data.location}' already exists`);
    }
    return await navigationRepository.create(data);
  }

  async getAllNavigation() {
    return await navigationRepository.findAll();
  }

  async getNavigationByLocation(location) {
    const nav = await navigationRepository.findByLocation(location);
    if (!nav) throw new ApiError(404, 'Navigation not found');
    return nav;
  }

  async updateNavigation(id, updateData) {
    const nav = await navigationRepository.findById(id);
    if (!nav) throw new ApiError(404, 'Navigation not found');

    if (updateData.location && updateData.location !== nav.location) {
      const existing = await navigationRepository.findByLocation(updateData.location);
      if (existing) throw new ApiError(400, `Navigation for location '${updateData.location}' already exists`);
    }

    Object.assign(nav, updateData);
    await nav.save(); // triggers pre-save order sorting
    return nav;
  }

  async deleteNavigation(id) {
    const nav = await navigationRepository.findById(id);
    if (!nav) throw new ApiError(404, 'Navigation not found');
    await navigationRepository.delete(id);
    return true;
  }
}

module.exports = new NavigationService();
