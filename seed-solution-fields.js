const mongoose = require('mongoose');
const Solution = require('./src/models/Solution.model.js');
require('dotenv').config();

const defaultMetrics = [
  { value: "22%", label: "Faster Table Turnover", desc: "Reduce wait times during peak shifts" },
  { value: "32%", label: "Less Ingredient Waste", desc: "Optimise portions & control recipes" },
  { value: "98%", label: "KDS Accuracy", desc: "Eliminate order errors & lost tickets" },
  { value: "15 hrs", label: "Saved Weekly", desc: "Cut manual inventory check stress" }
];

const defaultSpeeds = ["12ms", "18ms", "24ms", "15ms", "20ms", "30ms"];
const defaultAccuracies = ["99.8%", "99.4%", "99.9%", "99.5%", "99.7%", "99.6%"];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
    console.log('Connected to DB');
    
    const solutions = await Solution.find();
    for (const sol of solutions) {
      let updated = false;
      
      if (!sol.category) {
        sol.category = 'Core Operations';
        updated = true;
      }

      if (!sol.layerTitle) {
        sol.layerTitle = 'One unified layer, *infinite control*';
        updated = true;
      }

      if (!sol.layerDesc) {
        sol.layerDesc = 'Digitory works as a smart, real-time operating layer. We interface directly with POS, inventory levels, recipe configurations, and KDS monitors to automate every task seamlessly.';
        updated = true;
      }

      if (!sol.metricsTitle) {
        sol.metricsTitle = 'Real operational *outcomes & metrics*';
        updated = true;
      }

      if (!sol.metricsItems || sol.metricsItems.length === 0) {
        sol.metricsItems = defaultMetrics;
        updated = true;
      }

      if (!sol.businessTypesTitle) {
        sol.businessTypesTitle = 'Built for every kind of *food business*';
        updated = true;
      }

      if (!sol.businessTypesDesc) {
        sol.businessTypesDesc = 'No matter what type of food or beverage business you run, Digitory adapts to your operations, inventory configurations, and team roles.';
        updated = true;
      }

      // Add speed and accuracy to features if missing
      if (sol.features && sol.features.length > 0) {
        sol.features.forEach((feat, idx) => {
          if (!feat.speed) {
            feat.speed = defaultSpeeds[idx % defaultSpeeds.length];
            updated = true;
          }
          if (!feat.accuracy) {
            feat.accuracy = defaultAccuracies[idx % defaultAccuracies.length];
            updated = true;
          }
        });
      }

      if (updated) {
        // Mark features array as modified so mongoose saves it if modified inside foreach
        sol.markModified('features');
        await sol.save();
        console.log('Seeded defaults for solution:', sol.title);
      }
    }
    
    console.log('Seeding Solutions Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
