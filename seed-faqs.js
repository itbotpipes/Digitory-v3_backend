const mongoose = require('mongoose');
const Industry = require('./src/models/Industry.model.js');
const Solution = require('./src/models/Solution.model.js');
require('dotenv').config();

const defaultFaqs = [
  {
    question: "How does Digitory manage orders from different platforms?",
    answer: "Whether it's dine-in, online orders, QR or direct orders, everything flows into one connected system, so you never have to switch between multiple apps."
  },
  {
    question: "How does the kitchen stay in sync during rush hours?",
    answer: "Orders are sent to the right kitchen station instantly, reducing communication gaps, delays and missed tickets when every second counts."
  },
  {
    question: "Can Digitory help reduce inventory wastage?",
    answer: "Yes. Inventory updates automatically with every sale, helping you track stock movement, reduce wastage and protect your margins."
  },
  {
    question: "Can I manage customer loyalty and repeat business?",
    answer: "Absolutely. Build customer profiles, run loyalty programs and targeted campaigns that keep guests coming back."
  },
  {
    question: "Will I get real-time reports and insights?",
    answer: "Yes. Monitor sales, inventory, outlet performance and business trends in real time, so you can make faster, data-backed decisions."
  },
  {
    question: "Can I manage multiple outlets from one dashboard?",
    answer: "Yes. Compare outlet performance, monitor operations, and track key metrics across all your locations without chasing managers for updates."
  },
  {
    question: "Will billing slow us down during peak hours?",
    answer: "Not at all. Digitory is built for handling chaos better, helping your team bill faster, reducing queues, and keeping operations moving smoothly during rush hours."
  }
];

const defaultSupport = [
  "Training for your team",
  "Quick onboarding",
  "Phone, chat, and email support",
  "Compatibility with printers, cash drawers, and POS hardware",
  "Custom dashboards for owners, managers, accountants, chefs, and staff"
];

const defaultSecurity = [
  "End-to-end data encryption",
  "Secure role-based permissions",
  "PCI-DSS compliant payments",
  "Automated cloud backups"
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
    console.log('Connected to DB');

    // 1. Seed FAQs for Industries
    const industries = await Industry.find();
    for (const ind of industries) {
      if (!ind.faqs || ind.faqs.length === 0) {
        ind.faqs = defaultFaqs;
        await ind.save();
        console.log('Seeded FAQs for industry:', ind.title);
      }
    }

    // 2. Seed FAQs, supportItems, securityItems for Solutions
    const solutions = await Solution.find();
    for (const sol of solutions) {
      let updated = false;
      if (!sol.faqs || sol.faqs.length === 0) {
        sol.faqs = defaultFaqs;
        updated = true;
      }
      if (!sol.supportItems || sol.supportItems.length === 0) {
        sol.supportItems = defaultSupport;
        updated = true;
      }
      if (!sol.securityItems || sol.securityItems.length === 0) {
        sol.securityItems = defaultSecurity;
        updated = true;
      }
      if (updated) {
        await sol.save();
        console.log('Seeded FAQs & Support/Security for solution:', sol.title);
      }
    }

    console.log('Seeding FAQs & Support completed!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
