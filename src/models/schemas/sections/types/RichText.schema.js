const mongoose = require('mongoose');

/**
 * Rich Text Section Schema
 * 
 * WYSIWYG/Markdown block for standard text formatting.
 */
const richTextSectionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      description: 'Raw HTML or Markdown content',
    },
  },
  { _id: false }
);

module.exports = richTextSectionSchema;
