const mongoose = require('mongoose');
const seoSchema = require('../schemas/SEO.schema');
const sectionBaseSchema = require('../schemas/sections/SectionBase.schema');

const baseContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
    sections: [sectionBaseSchema],
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = baseContentSchema;
