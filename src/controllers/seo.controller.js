const SeoEntry = require('../models/SeoEntry.model');
const Post = require('../models/Post.model');
const Page = require('../models/Page.model');
const Solution = require('../models/Solution.model');
const Industry = require('../models/Industry.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

// GET /api/seo
exports.getAllSeo = asyncHandler(async (req, res) => {
  // Ensure the core website pages exist in the Page collection
  const privacyContent = `1. The Operational Challenge in India F&B\nManaging multi-outlet F&B brands in India requires navigating diverse supply chains, seasonal ingredient pricing, and intense competition.\n\nWithout unified software, restaurant owners spend hours reconciling POS numbers with manual inventory sheets, leaving wide gaps for leakage and missed margins.\n\n2. Digitory Smart Automation Ecosystem\nDigitory offers an end-to-end OS tailored for Indian restaurants, integrating order management, central kitchen management, and automated stock reconciliation.\n\nUnified POS & Central Kitchen Management\nInstant whatsapp alerts for inventory anomalies\nGST compliant billing & multi-branch reconciliation`;
  const termsContent = `3. Real-Time Analytics & Growth\nWith real-time reports accessible on any device, decision-makers can monitor daily sales, food cost percentages, and best-selling items at a glance.\n\nWhy India Trust Digitory\nBy providing 100% transparency into kitchen operations, Digitory enables restaurant founders to expand from 1 to 50+ locations with confidence.\n\nWhat's next\nLearn more about how Digitory can transform your restaurant business today.`;

  const corePages = [
    { title: 'Home', slug: 'home', content: 'Static page content for Home' },
    { title: 'About', slug: 'about', content: 'Static page content for About' },
    { title: 'Solutions', slug: 'solutions', content: 'Static page content for Solutions' },
    { title: 'Contact', slug: 'contact', content: 'Static page content for Contact' },
    { title: 'Request Demo', slug: 'request-demo', content: 'Static page content for Request Demo' },
    { title: 'Resources', slug: 'blog', content: 'Static page content for Resources' },
    { title: 'Privacy Policy', slug: 'privacy', content: privacyContent },
    { title: 'Terms of Service', slug: 'terms', content: termsContent }
  ];

  for (const page of corePages) {
    const exists = await Page.findOne({ slug: page.slug });
    if (!exists) {
      await Page.create({
        title: page.title,
        slug: page.slug,
        status: 'Published',
        content: page.content
      });
    }
  }

  // To show all pages in the table, we should fetch from Post, Page, Solution, Industry then attach SEO
  const [posts, pages, solutions, industries, seoEntries] = await Promise.all([
    Post.find({}).select('title slug status updatedAt createdAt').lean(),
    Page.find({}).select('title slug status updatedAt createdAt').lean(),
    Solution.find({}).select('title slug status updatedAt createdAt').lean(),
    Industry.find({}).select('title slug status updatedAt createdAt').lean(),
    SeoEntry.find({}).lean()
  ]);

  const seoMap = {};
  seoEntries.forEach(seo => {
    if (seo.pageId) {
      seoMap[seo.pageId.toString()] = seo;
    }
  });

  const mapData = (items, type) => items.map(item => {
    let url = '';
    if (type === 'Post') {
      url = `/blog/${item.slug}`;
    } else if (type === 'Solution') {
      url = `/solutions/${item.slug}`;
    } else if (type === 'Industry') {
      url = `/restaurant-types/${item.slug}`;
    } else if (type === 'Page') {
      url = item.slug === 'home' ? '/' : `/${item.slug}`;
    }
    url = url.replace(/\/\/+/g, '/');

    return {
      _id: item._id,
      pageType: type,
      name: item.title,
      url,
      slug: item.slug,
      status: item.status || 'Published',
      updatedAt: item.updatedAt || item.createdAt,
      seo: seoMap[item._id.toString()] || null
    };
  });

  const allData = [
    ...mapData(posts, 'Post'),
    ...mapData(pages, 'Page'),
    ...mapData(solutions, 'Solution'),
    ...mapData(industries, 'Industry')
  ];

  // Calculate some analytics
  const missingTitle = allData.filter(p => !p.seo || !p.seo.title).length;
  const missingDesc = allData.filter(p => !p.seo || !p.seo.description).length;
  const noIndex = allData.filter(p => p.seo && p.seo.robotsIndex === 'noindex').length;

  const titles = allData.map(p => p.seo?.title).filter(Boolean);
  const duplicateTitles = titles.length - new Set(titles).size;

  const descriptions = allData.map(p => p.seo?.description).filter(Boolean);
  const duplicateDescriptions = descriptions.length - new Set(descriptions).size;

  // Simple SEO score out of 100
  let score = 100;
  if (allData.length > 0) {
    const penalty = (missingTitle * 10 + missingDesc * 8 + duplicateTitles * 5 + duplicateDescriptions * 4) / allData.length;
    score = Math.max(20, 100 - penalty);
  }

  const analytics = {
    totalEntries: allData.length,
    missingTitle,
    missingDesc,
    noIndex,
    duplicateTitles,
    duplicateDescriptions,
    score: Math.round(score)
  };

  return res.status(200).json(new ApiResponse(200, { list: allData, analytics }, 'SEO Pages and Analytics'));
});

// GET /api/seo/:pageType/:pageId
exports.getSeoByPage = asyncHandler(async (req, res) => {
  const { pageType, pageId } = req.params;
  const seo = await SeoEntry.findOne({ pageId, pageType });
  return res.status(200).json(new ApiResponse(200, seo || null, 'Fetched SEO entry'));
});

// GET /api/seo/analytics
exports.getSeoAnalytics = asyncHandler(async (req, res) => {
  const [posts, pages, solutions, industries, seoEntries] = await Promise.all([
    Post.find({}).select('title slug').lean(),
    Page.find({}).select('title slug').lean(),
    Solution.find({}).select('title slug').lean(),
    Industry.find({}).select('title slug').lean(),
    SeoEntry.find({}).lean()
  ]);

  const mapData = (items, type) => items.map(item => {
    let url = '';
    if (type === 'Post') {
      url = `/blog/${item.slug}`;
    } else if (type === 'Solution') {
      url = `/solutions/${item.slug}`;
    } else if (type === 'Industry') {
      url = `/restaurant-types/${item.slug}`;
    } else if (type === 'Page') {
      url = item.slug === 'home' ? '/' : `/${item.slug}`;
    }
    url = url.replace(/\/\/+/g, '/');

    return {
      _id: item._id,
      pageType: type,
      name: item.title,
      url,
      slug: item.slug
    };
  });

  const allData = [
    ...mapData(posts, 'Post'),
    ...mapData(pages, 'Page'),
    ...mapData(solutions, 'Solution'),
    ...mapData(industries, 'Industry')
  ];

  const seoMap = {};
  seoEntries.forEach(seo => {
    if (seo.pageId) {
      seoMap[seo.pageId.toString()] = seo;
    }
  });

  const missingTitle = allData.filter(p => !seoMap[p._id.toString()] || !seoMap[p._id.toString()].title).length;
  const missingDesc = allData.filter(p => !seoMap[p._id.toString()] || !seoMap[p._id.toString()].description).length;
  const noIndex = allData.filter(p => seoMap[p._id.toString()] && seoMap[p._id.toString()].robotsIndex === 'noindex').length;

  const titles = allData.map(p => seoMap[p._id.toString()]?.title).filter(Boolean);
  const duplicateTitles = titles.length - new Set(titles).size;

  const descriptions = allData.map(p => seoMap[p._id.toString()]?.description).filter(Boolean);
  const duplicateDescriptions = descriptions.length - new Set(descriptions).size;

  let score = 100;
  if (allData.length > 0) {
    const penalty = (missingTitle * 10 + missingDesc * 8 + duplicateTitles * 5 + duplicateDescriptions * 4) / allData.length;
    score = Math.max(20, 100 - penalty);
  }

  const analytics = {
    totalEntries: allData.length,
    missingTitle,
    missingDesc,
    noIndex,
    duplicateTitles,
    duplicateDescriptions,
    score: Math.round(score)
  };

  return res.status(200).json(new ApiResponse(200, analytics, 'SEO Analytics'));
});

// POST /api/seo
exports.saveSeo = asyncHandler(async (req, res) => {
  const { pageId, pageType, ...seoData } = req.body;

  if (!pageId || !pageType) {
    return res.status(400).json(new ApiResponse(400, null, 'pageId and pageType are required'));
  }

  let slug = seoData.slug;
  if (!slug) {
    if (pageType === 'Post') {
      const item = await Post.findById(pageId).select('slug');
      if (item) slug = item.slug;
    } else if (pageType === 'Page') {
      const item = await Page.findById(pageId).select('slug');
      if (item) slug = item.slug;
    } else if (pageType === 'Solution') {
      const item = await Solution.findById(pageId).select('slug');
      if (item) slug = item.slug;
    } else if (pageType === 'Industry') {
      const item = await Industry.findById(pageId).select('slug');
      if (item) slug = item.slug;
    }
  }

  // Update both the SEO entry and the underlying collection's slug
  if (slug) {
    if (pageType === 'Post') {
      await Post.findByIdAndUpdate(pageId, { $set: { slug } });
    } else if (pageType === 'Page') {
      await Page.findByIdAndUpdate(pageId, { $set: { slug } });
    } else if (pageType === 'Solution') {
      await Solution.findByIdAndUpdate(pageId, { $set: { slug } });
    } else if (pageType === 'Industry') {
      await Industry.findByIdAndUpdate(pageId, { $set: { slug } });
    }
  }

  const updatedSeo = await SeoEntry.findOneAndUpdate(
    { pageId, pageType },
    { $set: { ...seoData, slug, updatedBy: req.user?.id } },
    { new: true, upsert: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedSeo, 'SEO updated successfully'));
});

// POST /api/seo/bulk
exports.bulkUpdateSeo = asyncHandler(async (req, res) => {
  const { updates } = req.body; // Array of { pageId, pageType, data }

  if (!Array.isArray(updates)) {
    return res.status(400).json(new ApiResponse(400, null, 'updates must be an array'));
  }

  const ops = updates.map(update => ({
    updateOne: {
      filter: { pageId: update.pageId, pageType: update.pageType },
      update: { $set: update.data },
      upsert: true
    }
  }));

  if (ops.length > 0) {
    await SeoEntry.bulkWrite(ops);
  }

  return res.status(200).json(new ApiResponse(200, null, 'Bulk SEO update successful'));
});

// GET /api/seo/:pageType/slug/:slug
exports.getSeoBySlug = asyncHandler(async (req, res) => {
  const { pageType, slug } = req.params;
  const seo = await SeoEntry.findOne({ slug, pageType });
  return res.status(200).json(new ApiResponse(200, seo, 'Fetched SEO entry by slug'));
});
