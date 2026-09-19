const mongoose = require('mongoose');
const Testimonial = require('./src/models/Testimonial.model.js');
require('dotenv').config();

const defaultTestimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner',
    designation: 'Owner',
    location: 'BygBrewski Bangalore',
    company: 'BygBrewski Bangalore',
    initials: 'RK',
    stat: '↑ 22% faster service',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-kitchen-41563-large.mp4',
    quote: 'Before Digitory, our busiest hours were stressful. Now every team gets live updates, and everything runs much more smoothly.',
    status: 'Published',
    order: 1,
  },
  {
    name: 'Priya Mehta',
    role: 'Ops Head',
    designation: 'Ops Head',
    location: 'Toit Brewpub',
    company: 'Toit Brewpub',
    initials: 'PM',
    stat: '3 Hours Saved Every Day',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waiter-serving-food-to-customers-in-a-restaurant-41558-large.mp4',
    quote: 'We spend less time managing operations and more time serving customers. Digitory helps us run every outlet with confidence.',
    status: 'Published',
    order: 2,
  },
  {
    name: 'Amit Shah',
    role: 'F&B Director',
    designation: 'F&B Director',
    location: 'Bier Library',
    company: 'Bier Library',
    initials: 'AS',
    stat: '₹2 Lakh Saved Every Month',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-barista-making-a-latte-art-41549-large.mp4',
    quote: 'We reduced food waste and improved inventory tracking. Within the first three months, we recovered nearly ₹2 lakh every month.',
    status: 'Published',
    order: 3,
  },
  {
    name: 'Ananya Sharma',
    role: 'General Manager',
    designation: 'General Manager',
    location: 'Social Offline',
    company: 'Social Offline',
    initials: 'AS',
    stat: '95% Reduction in Errors',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bar-tender-preparing-a-cocktail-41550-large.mp4',
    quote: 'Digitory integrated seamlessly with our POS and kitchen display system. Order errors dropped to almost zero across outlets.',
    status: 'Published',
    order: 4,
  },
  {
    name: 'Vikram Roy',
    role: 'Co-Founder',
    designation: 'Co-Founder',
    location: 'Truffles & Co',
    company: 'Truffles & Co',
    initials: 'VR',
    stat: '5x Faster Outlet Expansion',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-decorating-a-plate-41561-large.mp4',
    quote: "Scaling to 5 new outlets was effortless with Digitory's centralized multi-location dashboards and real-time inventory alerts.",
    status: 'Published',
    order: 5,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
    console.log('Connected to DB');

    for (const t of defaultTestimonials) {
      const exists = await Testimonial.findOne({ name: t.name, quote: t.quote });
      if (!exists) {
        await Testimonial.create(t);
        console.log('Created testimonial:', t.name);
      } else {
        await Testimonial.updateOne({ _id: exists._id }, { $set: t });
        console.log('Updated testimonial:', t.name);
      }
    }

    console.log('Testimonials seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
