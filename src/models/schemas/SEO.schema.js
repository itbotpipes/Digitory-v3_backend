const mongoose = require('mongoose');
const mediaReferenceSchema = require('./MediaReference.schema');

/**
 * SEO Schema
 * 
 * Reusable embedded schema for page and content SEO settings.
 * Supports standard meta tags, OpenGraph, and Twitter Cards.
 */
const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
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
    openGraph: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      image: mediaReferenceSchema,
    },
    twitterCard: {
      cardType: { type: String, enum: ['summary', 'summary_large_image'], default: 'summary_large_image' },
      site: { type: String, trim: true },
      creator: { type: String, trim: true },
    },
    robots: {
      type: String,
      trim: true,
      default: 'index, follow',
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed, // Allowed here strictly for raw JSON-LD input
    },
  },
  { _id: false }
);

module.exports = seoSchema;
