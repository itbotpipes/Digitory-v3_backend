const mongoose = require('mongoose');

/**
 * SectionBase Schema
 * 
 * The base structure for all dynamic page sections.
 * This acts as the parent for the discriminator registry.
 */
const sectionBaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      description: 'Internal admin identifier for this section block',
    },
    order: {
      type: Number,
      default: 0,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    discriminatorKey: 'type', // Key used by mongoose to resolve the exact section schema
    _id: true, // Unique ID for each block instance
  }
);

module.exports = sectionBaseSchema;
