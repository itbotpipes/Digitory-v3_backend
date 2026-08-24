const mongoose = require('mongoose');
const seoSchema = require('./schemas/SEO.schema');
const linkSchema = require('./schemas/Link.schema');

const settingsSchema = new mongoose.Schema(
  {
    branding: {
      logo: { type: String, description: 'URL to logo image' },
      favicon: { type: String, description: 'URL to favicon' },
      companyName: { type: String, trim: true },
    },
    defaultSeo: {
      type: seoSchema,
      default: () => ({}),
    },
    contactInformation: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        link: { type: linkSchema, required: true },
      },
    ],
    solutionsGridTitle: { type: String, default: 'Twelve powerful features to help your restaurant run better' },
    solutionsGridDesc: { type: String, default: 'Click on any feature card below to open its full specifications and details on a new page.' },
  },
  {
    timestamps: true,
  }
);

settingsSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Settings', settingsSchema).countDocuments();
    if (count > 0) {
      throw new Error('Only one Settings document can exist.');
    }
  }
});

settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
