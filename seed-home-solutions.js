const mongoose = require('mongoose');
const Solution = require('./src/models/Solution.model.js');
require('dotenv').config();

const homeDefaults = [
  {
    slug: 'pos',
    homeTitle: 'Orders & billing',
    homeDescription: 'Manage dine-in, takeaway, online, and QR orders in one place. Billing is quick, simple, and accurate.',
    homeImage: '/image4.png',
    homeOrder: 1,
    showOnHome: true,
  },
  {
    slug: 'kds',
    homeTitle: 'Kitchen display system',
    homeDescription: 'Orders go straight to the right kitchen station. No paper. No shouting. No confusion.',
    homeImage: '/image 6.png',
    homeOrder: 2,
    showOnHome: true,
  },
  {
    slug: 'inventory',
    homeTitle: 'Smart Inventory',
    homeDescription: "Every order automatically updates your stock. Know what's running low before it becomes a problem.",
    homeImage: '/image 7.png',
    homeOrder: 3,
    showOnHome: true,
  },
  {
    slug: 'reports',
    homeTitle: 'Live dashboard',
    homeDescription: 'View sales, orders, inventory, and outlet performance anytime from one screen.',
    homeImage: '/image 8.png',
    homeOrder: 4,
    showOnHome: true,
  },
  {
    slug: 'control-system',
    homeTitle: 'One order flow',
    homeDescription: 'Manage Swiggy, Zomato, QR, and dine-in orders together without switching between different apps.',
    homeImage: '/image 9.png',
    homeOrder: 5,
    showOnHome: true,
  },
  {
    slug: 'event-management',
    homeTitle: 'Multi-outlet management',
    homeDescription: 'Manage one outlet or many. View reports and performance from one dashboard.',
    homeImage: '/image 10.png',
    homeOrder: 6,
    showOnHome: true,
  },
];

async function seedHomeSolutions() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
    console.log('Connected to MongoDB');

    for (const item of homeDefaults) {
      const updated = await Solution.findOneAndUpdate(
        { slug: item.slug },
        {
          $set: {
            showOnHome: item.showOnHome,
            homeTitle: item.homeTitle,
            homeDescription: item.homeDescription,
            homeImage: item.homeImage,
            homeOrder: item.homeOrder,
          },
        },
        { new: true }
      );

      if (updated) {
        console.log(`Updated home settings for solution [${item.slug}]`);
      } else {
        console.warn(`Solution with slug [${item.slug}] not found`);
      }
    }

    console.log('Successfully seeded Home Page solution fields!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding home solutions:', err);
    process.exit(1);
  }
}

seedHomeSolutions();
