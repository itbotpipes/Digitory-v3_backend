/**
 * Seed script: Ensure Admin role has ['*'] permissions
 * Run: node seed-admin-role.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: String,
  permissions: [String],
}, { timestamps: true });

const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digitory');
  console.log('Connected to MongoDB');

  // Upsert Admin role with wildcard permission
  const result = await Role.findOneAndUpdate(
    { name: 'Admin' },
    { $set: { name: 'Admin', permissions: ['*'] } },
    { upsert: true, new: true }
  );
  console.log('✅ Admin role updated:', result);

  // Also ensure a basic "User" role exists
  const userRole = await Role.findOneAndUpdate(
    { name: 'User' },
    { $setOnInsert: { name: 'User', permissions: [] } },
    { upsert: true, new: true }
  );
  console.log('✅ User role ensured:', userRole.name, '| permissions:', userRole.permissions);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
