const Update = require('../models/Update.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/updates
exports.getAllUpdates = asyncHandler(async (req, res) => {
  const updates = await Update.find({}).sort({ publishedAt: -1 }).lean();
  
  // Seed fallback data if collection is empty so UI is not blank initially
  if (updates.length === 0) {
    const seedData = [
      {
        title: 'Introducing AI-driven demand forecasting',
        category: 'PRODUCT UPDATE',
        excerpt: 'Predict your daily inventory needs with 95% accuracy using our new machine learning engine.',
        content: 'Full details on our AI forecasting engine...',
        featuredImage: '/featured.png',
        publishedAt: new Date('2026-08-15')
      },
      {
        title: 'Seamless integration with Square and Toast POS',
        category: 'INTEGRATION',
        excerpt: 'Connect your POS systems in one click to sync sales data automatically.',
        content: 'Full details on POS integrations...',
        featuredImage: '/featured.png',
        publishedAt: new Date('2026-08-02')
      },
      {
        title: 'New multi-location performance dashboard',
        category: 'NEW FEATURE',
        excerpt: 'Compare metrics across all your restaurant branches from a single unified view.',
        content: 'Full details on the dashboard...',
        featuredImage: '/featured.png',
        publishedAt: new Date('2026-07-28')
      },
      {
        title: 'Summer 2026: Menu engineering best practices',
        category: 'GUIDE',
        excerpt: 'Optimize your menu profitability with these proven placement strategies.',
        content: 'Full details on menu engineering...',
        featuredImage: '/featured.png',
        publishedAt: new Date('2026-07-10')
      }
    ];
    const seeded = await Update.create(seedData);
    return res.status(200).json(new ApiResponse(200, seeded, 'Fetched all seeded updates'));
  }

  return res.status(200).json(new ApiResponse(200, updates, 'Fetched all updates'));
});

// GET /api/updates/:id
exports.getUpdateById = asyncHandler(async (req, res) => {
  const update = await Update.findById(req.params.id);
  if (!update) {
    return res.status(404).json(new ApiResponse(404, null, 'Update not found'));
  }
  return res.status(200).json(new ApiResponse(200, update, 'Fetched update successfully'));
});

// POST /api/updates
exports.createUpdate = asyncHandler(async (req, res) => {
  const { title, category, excerpt, content, featuredImage, publishedAt } = req.body;

  if (!title || !category || !excerpt) {
    return res.status(400).json(new ApiResponse(400, null, 'Title, category, and excerpt are required'));
  }

  const newUpdate = await Update.create({
    title,
    category,
    excerpt,
    content: content || '',
    featuredImage: featuredImage || '',
    publishedAt: publishedAt || new Date(),
  });

  return res.status(201).json(new ApiResponse(201, newUpdate, 'Created update successfully'));
});

// PUT /api/updates/:id
exports.updateUpdate = asyncHandler(async (req, res) => {
  const { title, category, excerpt, content, featuredImage, publishedAt } = req.body;

  const update = await Update.findById(req.params.id);
  if (!update) {
    return res.status(404).json(new ApiResponse(404, null, 'Update not found'));
  }

  update.title = title !== undefined ? title : update.title;
  update.category = category !== undefined ? category : update.category;
  update.excerpt = excerpt !== undefined ? excerpt : update.excerpt;
  update.content = content !== undefined ? content : update.content;
  update.featuredImage = featuredImage !== undefined ? featuredImage : update.featuredImage;
  update.publishedAt = publishedAt !== undefined ? publishedAt : update.publishedAt;

  await update.save();

  return res.status(200).json(new ApiResponse(200, update, 'Updated update successfully'));
});

// DELETE /api/updates/:id
exports.deleteUpdate = asyncHandler(async (req, res) => {
  const update = await Update.findById(req.params.id);
  if (!update) {
    return res.status(404).json(new ApiResponse(404, null, 'Update not found'));
  }

  await Update.findByIdAndDelete(req.params.id);

  return res.status(200).json(new ApiResponse(200, null, 'Deleted update successfully'));
});
