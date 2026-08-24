const fs = require('fs');
const path = require('path');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getRobotsPath = () => path.join(__dirname, '../../../digitory/public/robots.txt');

exports.getRobotsTxt = asyncHandler(async (req, res) => {
  const robotsPath = getRobotsPath();
  let content = '';
  
  if (fs.existsSync(robotsPath)) {
    content = fs.readFileSync(robotsPath, 'utf8');
  } else {
    content = 'User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml';
  }

  return res.status(200).json(new ApiResponse(200, { content }, 'robots.txt fetched'));
});

exports.saveRobotsTxt = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (typeof content !== 'string') {
    return res.status(400).json(new ApiResponse(400, null, 'content string is required'));
  }

  const robotsPath = getRobotsPath();
  fs.writeFileSync(robotsPath, content, 'utf8');

  return res.status(200).json(new ApiResponse(200, { content }, 'robots.txt saved'));
});
