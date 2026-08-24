const mongoose = require('mongoose');
const linkSchema = require('./Link.schema');
const mediaReferenceSchema = require('./MediaReference.schema');

/**
 * NavigationItem Schema
 * 
 * Recursive embedded schema for building multi-level menus.
 */
const navigationItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    link: linkSchema,
    icon: mediaReferenceSchema,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true } // Keep _id here so admin panel can easily update specific items in an array
);

// Add children recursively
navigationItemSchema.add({
  children: [navigationItemSchema],
});

module.exports = navigationItemSchema;
