const mongoose = require('mongoose');
const ctaSchema = require('../../CTA.schema');
const mediaReferenceSchema = require('../../MediaReference.schema');

/**
 * Hero Section Schema
 * 
 * High-impact top-fold block with heading, CTAs, and background media.
 */
const heroSchema = new mongoose.Schema(
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
    primaryCta: {
      type: ctaSchema,
    },
    secondaryCta: {
      type: ctaSchema,
    },
    backgroundImage: {
      type: mediaReferenceSchema,
    },
    alignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'center',
    },
  },
  { _id: false }
);

module.exports = heroSchema;
