const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['PRODUCT UPDATE', 'INTEGRATION', 'NEW FEATURE', 'GUIDE'],
      default: 'PRODUCT UPDATE',
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Update = mongoose.model('Update', updateSchema);
module.exports = Update;
