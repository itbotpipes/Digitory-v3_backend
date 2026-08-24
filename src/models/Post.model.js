const mongoose = require('mongoose');
const seoSchema = require('./schemas/SEO.schema');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: { type: String, trim: true },
    featuredImage: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    publishedAt: { type: Date },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String, trim: true }],
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

postSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
