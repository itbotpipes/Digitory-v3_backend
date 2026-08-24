const mongoose = require('mongoose');

/**
 * FAQ Section Schema
 * 
 * Accordion-style questions and answers block. References FAQ collection.
 */
const faqSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    faqs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faq',
      },
    ],
  },
  { _id: false }
);

module.exports = faqSectionSchema;
