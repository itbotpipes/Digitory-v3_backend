const mongoose = require('mongoose');
const baseContentSchema = require('./base/BaseContent.schema');

const pageSchema = baseContentSchema.clone();

pageSchema.add({
  content: {
    type: String,
    default: ''
  }
});

// Indexes
pageSchema.index({ slug: 1 }, { unique: true });
pageSchema.index({ status: 1 });

// Hooks: Slug Validation & Formatting
pageSchema.pre('validate', async function () {
  if (this.slug) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  } else if (this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  if (this.isModified('slug') || this.isNew) {
    const existing = await mongoose.models['Page'].findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });
    if (existing) {
      this.invalidate('slug', 'This slug is already in use.');
    }
  }
});

// Methods: Publish Workflow
pageSchema.methods.publish = async function () {
  this.status = 'Published';
  this.publishedAt = new Date();
  return await this.save();
};

pageSchema.methods.unpublish = async function () {
  this.status = 'Draft';
  this.publishedAt = null;
  return await this.save();
};

pageSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
