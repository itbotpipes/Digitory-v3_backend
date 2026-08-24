const mediaRepository = require('../repositories/Media.repository');
const ApiError = require('../utils/ApiError');
const { cloudinary } = require('../middlewares/upload');

class MediaService {
  async uploadMedia(file) {
    if (!file) throw new ApiError(400, 'No file uploaded');

    // When using multer-storage-cloudinary, file.path is the Cloudinary secure URL
    // and file.filename is the public_id
    const mediaData = {
      filename: file.filename,        // Cloudinary public_id (e.g. "digitory/abc123")
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: file.path,                 // Full Cloudinary HTTPS URL
    };

    return await mediaRepository.create(mediaData);
  }

  async getMedia(page, limit, search) {
    const filters = {};
    if (search) {
      filters.$text = { $search: search };
    }
    return await mediaRepository.paginate(page, limit, filters);
  }

  async deleteMedia(id) {
    const media = await mediaRepository.findById(id);
    if (!media) throw new ApiError(404, 'Media not found');

    // Delete from Cloudinary using the stored public_id
    try {
      await cloudinary.uploader.destroy(media.filename);
    } catch (err) {
      console.error('Cloudinary deletion error:', err.message);
      // Continue deletion from DB even if Cloudinary fails
    }

    await mediaRepository.delete(id);
    return true;
  }
}

module.exports = new MediaService();
