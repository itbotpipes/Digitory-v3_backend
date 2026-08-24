const Settings = require('../models/Settings.model');

class SettingsRepository {
  async getSettings() {
    return await Settings.getSettings();
  }

  async updateSettings(updateData) {
    const settings = await this.getSettings();
    return await Settings.findByIdAndUpdate(settings._id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new SettingsRepository();
