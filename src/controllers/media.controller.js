const mediaService = require('../services/media.service');
const ApiResponse = require('../utils/ApiResponse');

class MediaController {
  async uploadMedia(req, res) {
    const media = await mediaService.uploadMedia(req.file);
    res.status(201).json(new ApiResponse(201, media, 'File uploaded successfully'));
  }

  async getMedia(req, res) {
    const { page = 1, limit = 10, search } = req.query;
    const result = await mediaService.getMedia(page, limit, search);
    res.status(200).json(new ApiResponse(200, result, 'Media fetched successfully'));
  }

  async deleteMedia(req, res) {
    await mediaService.deleteMedia(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Media deleted successfully'));
  }
}

module.exports = new MediaController();
