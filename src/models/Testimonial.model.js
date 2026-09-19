const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL or local path
    },
    videoUrl: {
      type: String, // Video URL or path
      trim: true,
    },
    posterUrl: {
      type: String, // Video cover/poster image URL
      trim: true,
    },
    stat: {
      type: String, // e.g., "↑ 22% faster service"
      trim: true,
    },
    initials: {
      type: String, // e.g., "RK"
      trim: true,
    },
    role: {
      type: String, // e.g., "Owner"
      trim: true,
    },
    location: {
      type: String, // e.g., "BygBrewski Bangalore"
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
