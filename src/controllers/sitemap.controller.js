const fs = require('fs');
const path = require('path');
const Post = require('../models/Post.model');
const Page = require('../models/Page.model');
const Solution = require('../models/Solution.model');
const SeoEntry = require('../models/SeoEntry.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

exports.generateSitemap = asyncHandler(async (req, res) => {
  // Fetch all SeoEntries to filter out 'noindex'
  const seoEntries = await SeoEntry.find({}).lean();
  const noIndexSet = new Set(
    seoEntries.filter(seo => seo.robotsIndex === 'noindex').map(seo => seo.pageId.toString())
  );

  const [posts, pages, solutions] = await Promise.all([
    Post.find({ status: 'Published' }).select('slug updatedAt').lean(),
    Page.find({ status: 'Published' }).select('slug updatedAt').lean(),
    Solution.find({ status: 'Published' }).select('slug updatedAt').lean()
  ]);

  let urls = [];

  const addUrl = (items, prefix) => {
    items.forEach(item => {
      if (noIndexSet.has(item._id.toString())) return;
      urls.push(`
  <url>
    <loc>${FRONTEND_URL}${prefix}${item.slug}</loc>
    <lastmod>${(item.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
  };

  urls.push(`
  <url>
    <loc>${FRONTEND_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  addUrl(posts, '/blog/');
  addUrl(pages, '/');
  addUrl(solutions, '/solutions/');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  const sitemapPath = path.join(__dirname, '../../../digitory/public/sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

  return res.status(200).json(new ApiResponse(200, { urlsCount: urls.length, lastGenerated: new Date() }, 'Sitemap generated successfully'));
});

exports.getSitemapInfo = asyncHandler(async (req, res) => {
  const sitemapPath = path.join(__dirname, '../../../digitory/public/sitemap.xml');
  let exists = fs.existsSync(sitemapPath);
  let stats = null;
  
  if (exists) {
    const fileStats = fs.statSync(sitemapPath);
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const urlsCount = (content.match(/<url>/g) || []).length;
    stats = {
      lastGenerated: fileStats.mtime,
      urlsCount
    };
  }

  return res.status(200).json(new ApiResponse(200, stats, 'Sitemap info retrieved'));
});
