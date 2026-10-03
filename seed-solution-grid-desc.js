const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Solution = require('./src/models/Solution.model.js');

const solutionGridData = [
  {
    slug: 'pos',
    gridTitle: 'POS & Billing',
    gridDesc: 'Billing that keeps up. Dine-in, online, direct — every order and every payment through one fast, reliable system.'
  },
  {
    slug: 'qr-ordering',
    gridTitle: 'QR Code Ordering',
    gridDesc: 'Let guests order themselves. Guests scan, order, and pay from the table — synced live with waiter apps and kitchen.'
  },
  {
    slug: 'kds',
    gridTitle: 'Kitchen Display System (KDS)',
    gridDesc: 'The kitchen, in sync. Every ticket hits the right station instantly. Less shouting, less confusion, faster plates.'
  },
  {
    slug: 'booking',
    gridTitle: 'Table Reservations',
    gridDesc: 'Fill every table. Take bookings, manage covers, seat guests — no paper diary, no double-booking.'
  },
  {
    slug: 'inventory',
    gridTitle: 'Automated inventory management',
    gridDesc: "Inventory that thinks ahead. Every dish deducts stock automatically. Know what's running low before your chef does."
  },
  {
    slug: 'recipe-management',
    gridTitle: 'Recipe-Management',
    gridDesc: 'Cost every plate. Lock recipes, portions and costs so margins hold — even when prices move and staff change.'
  },
  {
    slug: 'menu-engineering',
    gridTitle: 'Menu Engineering',
    gridDesc: 'Optimize menu profitability. Analyze popularity, track food cost margins, and design high-yielding menus that boost bottom-line revenue.'
  },
  {
    slug: 'purchase-supplier',
    gridTitle: 'Purchase & Supplier',
    gridDesc: 'Manage purchase requests, track supplier invoices, log goods receipt details, and track food ingredient price variations.'
  },
  {
    slug: 'purchasing',
    gridTitle: 'Purchase & Supplier',
    gridDesc: 'Manage purchase requests, track supplier invoices, log goods receipt details, and track food ingredient price variations.'
  },
  {
    slug: 'reports',
    gridTitle: 'Business Analytics',
    gridDesc: 'Your business, live. Sales, orders, inventory, outlet performance — everything you need to know, in one place, in real time.'
  },
  {
    slug: 'loyalty',
    gridTitle: 'Customer Loyalty & CRM',
    gridDesc: "Regulars, not one-timers. Know who's coming back, reward them, and win the rest back with offers that actually land."
  },
  {
    slug: 'control-system',
    gridTitle: 'Multi-Outlet Management',
    gridDesc: 'One outlet or twenty. Full visibility across every location without chasing managers or waiting on end-of-day reports.'
  },
  {
    slug: 'event-management',
    gridTitle: 'Clubs & Events',
    gridDesc: 'Cashless, end to end. Prepaid ticketing to final settlement — run high-volume events with no cash handling and no leakage.'
  },
  {
    slug: 'payroll',
    gridTitle: 'Shift & Payroll Hub',
    gridDesc: 'Log worker attendance checklists, configure monthly shift schedules, track server table zones, and manage salary reports.'
  },
  {
    slug: 'central-kitchen',
    gridTitle: 'Central Prep Kitchen',
    gridDesc: 'Manage batch preparation formulas, track raw material shipping to outlets, and maintain consistent dish recipes centrally.'
  }
];

async function seedSolutionGridDesc() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    for (const item of solutionGridData) {
      const updated = await Solution.findOneAndUpdate(
        { slug: item.slug },
        {
          $set: {
            gridTitle: item.gridTitle,
            gridDesc: item.gridDesc,
          }
        },
        { new: true }
      );

      if (updated) {
        console.log(`Updated gridTitle and gridDesc for [${item.slug}] -> "${item.gridDesc.substring(0, 40)}..."`);
      } else {
        console.warn(`Solution slug [${item.slug}] not found in database.`);
      }
    }

    console.log('\nAll Solution grid descriptions updated successfully in MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding solution grid descriptions:', err);
    process.exit(1);
  }
}

seedSolutionGridDesc();
