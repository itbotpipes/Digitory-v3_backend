const Navigation = require('../models/Navigation.model');

class NavigationRepository {
  async findByLocation(location) {
    return await Navigation.findOne({ location });
  }

  async findById(id) {
    return await Navigation.findById(id);
  }

  async create(data) {
    return await Navigation.create(data);
  }

  async update(id, updateData) {
    return await Navigation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Navigation.findByIdAndDelete(id);
  }

  async findAll() {
    return await Navigation.find().sort({ location: 1 });
  }
}

module.exports = new NavigationRepository();
