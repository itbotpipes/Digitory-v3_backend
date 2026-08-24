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
