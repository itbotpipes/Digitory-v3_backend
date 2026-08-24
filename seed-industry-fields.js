const mongoose = require('mongoose');
const Industry = require('./src/models/Industry.model.js');
require('dotenv').config();

const legacyItemsDefault = [
  {
    title: 'Lagging Inventory Reconciliation',
    body: 'Taking stock manually at the end of the day leads to high inventory variance and stock shrinkage that goes unnoticed for weeks.',
    stat: '40%',
    statLabel: 'average inventory variance undetected'
  },
  {
    title: 'Kitchen and Floor Disconnection',
    body: 'Lost or delayed paper tickets result in extended customer wait times, cold food, and disappointed regulars.',
    stat: '15m',
    statLabel: 'order delay during peak rush hours'
  },
  {
    title: 'Siloed Multi-Outlet Reporting',
    body: 'Calculating regional performance across multiple outlets manually creates reporting lag and prevents quick operational adjustments.',
    stat: '3x',
    statLabel: 'reporting lag across separate venues'
  }
];

const workflowItemsDefault = [
  { n: '01 / Instant Routing', title: '01 / Instant Routing', desc: 'Real-time KOT updates prevent delays between floor staff and kitchen preparation.' },
  { n: '02 / Automated Audits', title: '02 / Automated Audits', desc: 'Real-time recipe deductions provide immediate clarity on ingredient usage.' },
  { n: '03 / Unified Dashboard', title: '03 / Unified Dashboard', desc: 'Consolidated insights eliminate manual spreadsheet reconciliation.' },
  { n: '04 / Central Control', title: '04 / Central Control', desc: 'Push menu, pricing, and tax updates to all locations in seconds.' }
];

const controlItemsDefault = [
  { title: '100% cloud', desc: 'Manage operations from your phone or browser instantly.' },
  { title: 'Offline Mode', desc: 'Billing counters function even if connection drops.' },
  { title: 'Role-based Access', desc: 'Secure operations by restricting employee permissions.' },
  { title: 'Central Menu Sync', desc: 'Update prices across all outlet locations globally.' }
];

function getIndustryStats(slug) {
  switch (slug) {
    case 'bars-restaurants':
      return [
        { label: 'Table Turnaround Time', value: '-20%', desc: 'Faster order-to-serve cycle' },
        { label: 'Staff Errors', value: '-85%', desc: 'Direct kitchen display routing' },
        { label: 'Pilferage & Shrinkage', value: '<1%', desc: 'Strict bar inventory controls' },
        { label: 'Customer Wait Times', value: '5m', desc: 'Accelerated digital payments' },
      ];
    case 'cafes':
      return [
        { label: 'Average Peak Transactions', value: '120/hr', desc: 'Accelerated checkout flow' },
        { label: 'Takeaway Error Rate', value: '0%', desc: 'Clear modifier and addon prints' },
        { label: 'Loyalty Adoption', value: '+45%', desc: 'Integrated points system' },
        { label: 'Waste Reduction', value: '-18%', desc: 'Precise daily production tracking' },
      ];
    case 'micro-breweries':
      return [
        { label: 'Brew Recipe Consistency', value: '100%', desc: 'Standardized batch ingredient tracking' },
        { label: 'Average Ticket Value', value: '+18%', desc: 'Upselling with smart combo notifications' },
        { label: 'Keg Inventory Variance', value: '<0.8%', desc: 'Automated taproom scale integration' },
        { label: 'Direct Tap Sales', value: '+32%', desc: 'Self-serve QR ordering tables' },
      ];
    case 'qsr':
      return [
        { label: 'Average Order Processing', value: '15s', desc: 'Simplified queue busting cashier flow' },
        { label: 'Recipe Ingredient Waste', value: '-30%', desc: 'Automated POS to stock decrement' },
        { label: 'Menu Push to Zomato', value: 'Instant', desc: 'Update prices and status globally' },
        { label: 'Order Accuracy', value: '99.9%', desc: 'Integrated kitchen display systems' },
      ];
    default:
      return [
        { label: 'Daily Service Speed', value: '+25%', desc: 'No paper slip delays or manual coordination' },
        { label: 'Inventory Cost Saved', value: '12%', desc: 'Smarter batching and real-time alerts' },
        { label: 'Customer Retention Rate', value: '+35%', desc: 'Automated loyalty campaigns' },
        { label: 'Multi-Outlet Sync', value: '100%', desc: 'Real-time data aggregation globally' },
      ];
  }
}

function mergeArrays(existing, defaults, uniqueKey = 'title') {
  if (!existing || existing.length === 0) return defaults;
  let merged = [...existing];
  
  for (const def of defaults) {
    const exists = merged.find(x => x[uniqueKey] === def[uniqueKey]);
    if (!exists) {
      merged.push(def);
    }
  }
  return merged;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
    console.log('Connected to DB');
    
    const industries = await Industry.find();
    for (const ind of industries) {
      let updated = false;
      
      const newLegacy = mergeArrays(ind.legacyItems, legacyItemsDefault);
      if (newLegacy.length !== (ind.legacyItems ? ind.legacyItems.length : 0)) {
        ind.legacyItems = newLegacy;
        updated = true;
      }
      
      const newWorkflow = mergeArrays(ind.workflowItems, workflowItemsDefault);
      if (newWorkflow.length !== (ind.workflowItems ? ind.workflowItems.length : 0)) {
        ind.workflowItems = newWorkflow;
        updated = true;
      }
      
      const newControl = mergeArrays(ind.controlItems, controlItemsDefault);
      if (newControl.length !== (ind.controlItems ? ind.controlItems.length : 0)) {
        ind.controlItems = newControl;
        updated = true;
      }
      
      const defEfficiency = getIndustryStats(ind.slug);
      const newEfficiency = mergeArrays(ind.efficiencyItems, defEfficiency, 'label');
      if (newEfficiency.length !== (ind.efficiencyItems ? ind.efficiencyItems.length : 0)) {
        ind.efficiencyItems = newEfficiency;
        updated = true;
      }
      
      if (updated) {
        await ind.save();
        console.log('Seeded defaults for:', ind.title);
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
