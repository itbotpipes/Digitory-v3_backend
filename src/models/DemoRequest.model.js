const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    purpose: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Qualified', 'Closed', 'Lost', 'Not Interested', 'Resolved'],
      default: 'New',
    },
    lastContactedDate: {
      type: Date,
      default: null,
    },
    callNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);
module.exports = DemoRequest;
