/**
 * Seed all core website page SEO data
 * Run: node seed-seo.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({ title: String, slug: String, status: String, content: String }, { timestamps: true });
const SeoEntrySchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, refPath: 'pageType' },
  pageType: { type: String, enum: ['Post', 'Page', 'Solution'] },
  title: String,
  description: String,
  keywords: [String],
  canonicalUrl: String,
  slug: String,
  robotsIndex: { type: String, default: 'index' },
  robotsFollow: { type: String, default: 'follow' },
  openGraph: { title: String, description: String, image: String },
  twitterCard: { title: String, description: String, image: String },
}, { timestamps: true });

SeoEntrySchema.index({ pageId: 1, pageType: 1 }, { unique: true });

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);
const SeoEntry = mongoose.models.SeoEntry || mongoose.model('SeoEntry', SeoEntrySchema);

const seoData = [
  {
    slug: 'home',
    title: 'Digitory | Restaurant Operating System',
    description: 'Transform your restaurant operations, reduce waste, and grow margins with Digitory — the all-in-one Restaurant OS built for modern restaurant groups.',
    keywords: ['restaurant operating system', 'restaurant POS', 'restaurant management software', 'digitory'],
    canonicalUrl: 'https://digitory.io',
    openGraph: {
      title: 'Digitory | Restaurant Operating System',
      description: 'Transform your restaurant operations with Digitory.',
      image: 'https://digitory.io/og-home.png',
    },
    twitterCard: {
      title: 'Digitory | Restaurant Operating System',
      description: 'Transform your restaurant operations with Digitory.',
    },
  },
  {
    slug: 'about',
    title: 'About Us | Digitory',
    description: 'Learn about Digitory\'s journey, mission, and the team building the future of restaurant operations technology.',
    keywords: ['about digitory', 'restaurant tech company', 'digitory team'],
    canonicalUrl: 'https://digitory.io/about',
    openGraph: {
      title: 'About Us | Digitory',
      description: 'Learn about Digitory\'s mission and the team behind it.',
    },
  },
  {
    slug: 'solutions',
    title: 'Restaurant Solutions | Digitory',
    description: 'Explore Digitory\'s complete suite of restaurant solutions — POS, inventory management, analytics, loyalty programs, and more.',
    keywords: ['restaurant solutions', 'restaurant POS', 'inventory management', 'restaurant analytics'],
    canonicalUrl: 'https://digitory.io/solutions',
    openGraph: {
      title: 'Restaurant Solutions | Digitory',
      description: 'The complete suite of restaurant technology solutions.',
    },
  },
  {
    slug: 'contact',
    title: 'Contact Us | Digitory',
    description: 'Get in touch with the Digitory team. We\'d love to help you transform your restaurant operations.',
    keywords: ['contact digitory', 'digitory support', 'restaurant tech support'],
    canonicalUrl: 'https://digitory.io/contact',
    openGraph: {
      title: 'Contact Us | Digitory',
      description: 'Get in touch with the Digitory team.',
    },
  },
  {
    slug: 'request-demo',
    title: 'Request a Demo | Digitory',
    description: 'See Digitory in action. Request a personalized demo and discover how we can transform your restaurant operations.',
    keywords: ['digitory demo', 'restaurant software demo', 'restaurant POS demo'],
    canonicalUrl: 'https://digitory.io/request-demo',
    openGraph: {
      title: 'Request a Demo | Digitory',
      description: 'Book a personalized demo of Digitory.',
    },
  },
  {
    slug: 'blog',
    title: 'Restaurant Insights & Resources | Digitory',
    description: 'Expert insights, guides, and resources for restaurant operators. Learn how to grow your restaurant business with Digitory.',
    keywords: ['restaurant blog', 'restaurant insights', 'restaurant management tips', 'restaurant technology'],
    canonicalUrl: 'https://digitory.io/blog',
    openGraph: {
      title: 'Restaurant Insights | Digitory Blog',
      description: 'Expert insights and resources for restaurant operators.',
    },
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
  console.log('Connected to MongoDB');

  for (const data of seoData) {
    const { slug, ...seo } = data;

    // Upsert the Page document
    const page = await Page.findOneAndUpdate(
      { slug },
      { $set: { slug, title: seo.title.split('|')[0].trim(), status: 'Published', content: `Static page: ${slug}` } },
      { upsert: true, new: true }
    );

    // Upsert the SEO entry linked to the page
    await SeoEntry.findOneAndUpdate(
      { pageId: page._id, pageType: 'Page' },
      { $set: { ...seo, slug, pageId: page._id, pageType: 'Page' } },
      { upsert: true, new: true }
    );

    console.log(`✅ Seeded SEO for: ${slug}`);
  }

  await mongoose.disconnect();
  console.log('Done. All core page SEO seeded.');
}

main().catch(err => { console.error(err); process.exit(1); });
