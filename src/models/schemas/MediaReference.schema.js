const mongoose = require('mongoose');

/**
 * MediaReference Schema
 * 
 * Reusable embedded schema for linking to the central Media collection.
 * Allows an optional alt text override for specific context.
 */
const mediaReferenceSchema = new mongoose.Schema(
  {
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media', // Reference to the central Media collection
      required: true,
    },
    altOverride: {
      type: String,
      trim: true,
    },
  },
  { _id: false } // Disable _id for embedded subdocuments to save space
);

module.exports = mediaReferenceSchema;
