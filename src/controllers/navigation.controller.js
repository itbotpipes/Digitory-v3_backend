const navigationService = require('../services/navigation.service');
const ApiResponse = require('../utils/ApiResponse');

class NavigationController {
  async createNavigation(req, res) {
    const nav = await navigationService.createNavigation(req.body);
    res.status(201).json(new ApiResponse(201, nav, 'Navigation created successfully'));
  }

  async getAllNavigation(req, res) {
    const navs = await navigationService.getAllNavigation();
    res.status(200).json(new ApiResponse(200, navs, 'Navigations fetched successfully'));
  }

  async getNavigationByLocation(req, res) {
    const nav = await navigationService.getNavigationByLocation(req.params.location);
    res.status(200).json(new ApiResponse(200, nav, 'Navigation fetched successfully'));
  }

  async updateNavigation(req, res) {
    const nav = await navigationService.updateNavigation(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, nav, 'Navigation updated successfully'));
  }

  async deleteNavigation(req, res) {
    await navigationService.deleteNavigation(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Navigation deleted successfully'));
  }
}

module.exports = new NavigationController();
