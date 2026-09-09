const fs = require('fs');
const path = require('path');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getLlmPath = () => path.join(__dirname, '../../../digitory/public/llm.txt');

exports.getLlmTxt = asyncHandler(async (req, res) => {
  const llmPath = getLlmPath();
  let content = '';
  
  if (fs.existsSync(llmPath)) {
    content = fs.readFileSync(llmPath, 'utf8');
  } else {
    content = `# Digitory - Restaurant Operating System\n\n> Manage rush hours, not rush. The operating system for modern restaurants.\n\n## Core System & Features\n- Point of Sale (POS) Integrations\n- Real-time Analytics & Anomaly Detection\n- Kitchen Display System (KDS)\n- Inventory & Recipe Management\n\n## Important Pages\n- [/about]: Learn more about Digitory\n- [/solutions]: Explore all 12 restaurant solutions\n- [/request-demo]: Request a live product demonstration\n- [/contact]: Get in touch with our team`;
  }

  return res.status(200).json(new ApiResponse(200, { content }, 'llm.txt fetched'));
});

exports.saveLlmTxt = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (typeof content !== 'string') {
    return res.status(400).json(new ApiResponse(400, null, 'content string is required'));
  }

  const llmPath = getLlmPath();
  const dir = path.dirname(llmPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(llmPath, content, 'utf8');

  return res.status(200).json(new ApiResponse(200, { content }, 'llm.txt saved successfully'));
});
