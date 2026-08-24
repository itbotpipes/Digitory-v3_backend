const mongoose = require('mongoose');

/**
 * Testimonials Section Schema
 * 
 * Sliders or grids of client quotes. References Testimonials collection.
 */
const testimonialsSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    testimonials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Testimonial',
      },
    ],
    layout: {
      type: String,
      enum: ['slider', 'grid'],
      default: 'slider',
    },
  },
  { _id: false }
);

module.exports = testimonialsSectionSchema;
