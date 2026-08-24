const mongoose = require('mongoose');
const mediaReferenceSchema = require('../../MediaReference.schema');

/**
 * Gallery Section Schema
 * 
 * Grid or masonry layout of images.
 */
const gallerySectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    images: [mediaReferenceSchema],
    layout: {
      type: String,
      enum: ['grid', 'masonry', 'carousel'],
      default: 'grid',
    },
  },
  { _id: false }
);

module.exports = gallerySectionSchema;
