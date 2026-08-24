const mongoose = require('mongoose');
const seoSchema = require('./schemas/SEO.schema');

const whyChooseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
}, { _id: false });

const featureItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String }, // SVG string
  speed: { type: String },
  accuracy: { type: String }
}, { _id: false });

const businessTypeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String } // SVG string
}, { _id: false });

const integrationCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: { type: String, required: true }
}, { _id: false });

const simpleBlockSchema = new mongoose.Schema({
  title: { type: String },
  desc: { type: String }
}, { _id: false });

const solutionSchema = new mongoose.Schema(
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
    image: { type: String },
    gridTitle: { type: String },
    gridDesc: { type: String },
    opsTitle: { type: String },
    opsParagraph: { type: String },
    opsHighlights: { type: String },
    
    whyChoose: [whyChooseSchema],
    
    featuresTitle: { type: String },
    features: [featureItemSchema],
    
    businessTypes: [businessTypeItemSchema],
    
    integrations: [integrationCategorySchema],
    
    extraGrowth: { type: simpleBlockSchema },
    extraOwnersChoice: { type: simpleBlockSchema },
    
    supportItems: [{ type: String }],
    securityItems: [{ type: String }],
    
    faqs: [{
      question: { type: String },
      answer: { type: String }
    }],
    
    ctaBlock: { type: simpleBlockSchema },

    category: { type: String },
    layerTitle: { type: String },
    layerDesc: { type: String },
    metricsTitle: { type: String },
    metricsItems: [{
      value: { type: String },
      label: { type: String },
      desc: { type: String }
    }],
    businessTypesTitle: { type: String },
    businessTypesDesc: { type: String },
    
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;
