const mongoose = require('mongoose');

const seoEntrySchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'pageType',
    },
    pageType: {
      type: String,
      required: true,
      enum: ['Post', 'Page', 'Solution'],
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    canonicalUrl: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    robotsIndex: {
      type: String,
      enum: ['index', 'noindex'],
      default: 'index',
    },
    robotsFollow: {
      type: String,
      enum: ['follow', 'nofollow'],
      default: 'follow',
    },
    openGraph: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      image: { type: String, trim: true },
    },
    twitterCard: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      image: { type: String, trim: true },
    },
    schemaType: {
      type: String,
      enum: ['None', 'Organization', 'Product', 'Article', 'FAQ', 'Breadcrumb', 'LocalBusiness', 'Custom'],
      default: 'None',
    },
    schemaData: {
      type: mongoose.Schema.Types.Mixed,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Ensure one SEO entry per page
seoEntrySchema.index({ pageId: 1, pageType: 1 }, { unique: true });

const SeoEntry = mongoose.model('SeoEntry', seoEntrySchema);
module.exports = SeoEntry;
