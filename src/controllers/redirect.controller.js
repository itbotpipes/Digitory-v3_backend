const Redirect = require('../models/Redirect.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/redirects
exports.getRedirects = asyncHandler(async (req, res) => {
  const redirects = await Redirect.find({}).sort({ createdAt: -1 }).lean();
  return res.status(200).json(new ApiResponse(200, redirects, 'Fetched redirects'));
});

// POST /api/redirects
exports.createRedirect = asyncHandler(async (req, res) => {
  const { oldUrl, newUrl, status, isEnabled } = req.body;
  if (!oldUrl || !newUrl) {
    return res.status(400).json(new ApiResponse(400, null, 'oldUrl and newUrl are required'));
  }
  
  const redirect = await Redirect.create({ oldUrl, newUrl, status, isEnabled, updatedBy: req.user?.id });
  return res.status(201).json(new ApiResponse(201, redirect, 'Redirect created'));
});

// PUT /api/redirects/:id
exports.updateRedirect = asyncHandler(async (req, res) => {
  const redirect = await Redirect.findByIdAndUpdate(
    req.params.id, 
    { ...req.body, updatedBy: req.user?.id }, 
    { new: true }
  );
  if (!redirect) return res.status(404).json(new ApiResponse(404, null, 'Redirect not found'));
  return res.status(200).json(new ApiResponse(200, redirect, 'Redirect updated'));
});

// DELETE /api/redirects/:id
exports.deleteRedirect = asyncHandler(async (req, res) => {
  const redirect = await Redirect.findByIdAndDelete(req.params.id);
  if (!redirect) return res.status(404).json(new ApiResponse(404, null, 'Redirect not found'));
  return res.status(200).json(new ApiResponse(200, null, 'Redirect deleted'));
});
