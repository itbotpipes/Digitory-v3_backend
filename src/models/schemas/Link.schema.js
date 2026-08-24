const mongoose = require('mongoose');

/**
 * Link Schema
 * 
 * Reusable embedded schema for URLs, standardizing target behavior.
 */
const linkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: String,
      enum: ['_self', '_blank'],
      default: '_self',
    },
    rel: {
      type: String,
      trim: true,
      default: 'noopener noreferrer',
    },
  },
  { _id: false }
);

module.exports = linkSchema;
