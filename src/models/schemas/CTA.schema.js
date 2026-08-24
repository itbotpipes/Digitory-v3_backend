const mongoose = require('mongoose');
const linkSchema = require('./Link.schema');

/**
 * CTA (Call to Action) Schema
 * 
 * Reusable embedded schema for buttons and action links.
 * Combines label, styling, and the Link schema.
 */
const ctaSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: linkSchema,
      required: true,
    },
    style: {
      type: String,
      enum: ['primary', 'secondary', 'outline', 'text'],
      default: 'primary',
    },
  },
  { _id: false }
);

module.exports = ctaSchema;
