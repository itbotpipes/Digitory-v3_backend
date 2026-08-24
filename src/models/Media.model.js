const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
      description: 'Local file path or URL to access the media',
    },
  },
  {
    timestamps: true,
  }
);

mediaSchema.index({ filename: 'text', originalName: 'text' });
mediaSchema.index({ mimeType: 1 });

mediaSchema.set('toJSON', { virtuals: true });
mediaSchema.set('toObject', { virtuals: true });

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
