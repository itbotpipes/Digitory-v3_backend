const mongoose = require('mongoose');
const ctaSchema = require('../../CTA.schema');

/**
 * CTA Section Schema
 * 
 * Standalone Call To Action banner.
 */
const ctaSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: {
      type: String,
      trim: true,
    },
    cta: {
      type: ctaSchema,
      required: true,
    },
    layout: {
      type: String,
      enum: ['standard', 'split'],
      default: 'standard',
    },
  },
  { _id: false }
);

module.exports = ctaSectionSchema;
