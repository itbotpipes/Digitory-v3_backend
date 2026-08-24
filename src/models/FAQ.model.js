const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
