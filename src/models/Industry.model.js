const mongoose = require('mongoose');
const seoSchema = require('./schemas/SEO.schema');

const featureItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String }, // SVG string
  linkText: { type: String },
  linkHref: { type: String }
}, { _id: false });

const simpleBlockSchema = new mongoose.Schema({
  title: { type: String },
  desc: { type: String }
}, { _id: false });

const industrySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    shortLabel: { type: String, required: true },
    icon: { type: String }, // SVG string
    title: { type: String, required: true },
    badge: { type: String },
    subtitle: { type: String },
    description: { type: String },
    ctaText: { type: String },
    trustText: { type: String },
    heroImage: { type: String },
    image: { type: String }, // card image on grid list

    heroTitle: { type: String },

    gridTitle: { type: String },
    gridDesc: { type: String },
    opsTitle: { type: String },
    opsParagraph: { type: String },
    opsHighlights: { type: String },

    legacyTitle: { type: String },
    legacyItems: [{
      title: { type: String },
      body: { type: String },
      stat: { type: String },
      statLabel: { type: String }
    }],

    workflowTitle: { type: String },
    workflowDesc: { type: String },
    workflowItems: [{
      n: { type: String },
      title: { type: String },
      desc: { type: String }
    }],

    controlTitle: { type: String },
    controlDesc: { type: String },
    controlItems: [{
      title: { type: String },
      desc: { type: String }
    }],

    efficiencyTitle: { type: String },
    efficiencyItems: [{
      value: { type: String },
      label: { type: String },
      desc: { type: String }
    }],

    featuresTitle: { type: String },
    features: [featureItemSchema],

    whyChooseTitle: { type: String },
    whyChoose: [{ type: String }],

    faqs: [{
      question: { type: String },
      answer: { type: String }
    }],

    ctaBlock: { type: simpleBlockSchema },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

const Industry = mongoose.model('Industry', industrySchema);
module.exports = Industry;
