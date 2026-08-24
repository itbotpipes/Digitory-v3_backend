const settingsService = require('../services/settings.service');
const ApiResponse = require('../utils/ApiResponse');

class SettingsController {
  async getSettings(req, res) {
    const settings = await settingsService.getSettings();
    res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'));
  }

  async updateSettings(req, res) {
    const settings = await settingsService.updateSettings(req.body);
    res.status(200).json(new ApiResponse(200, settings, 'Settings updated successfully'));
  }
}

module.exports = new SettingsController();
