const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const updateDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const Solution = require('./src/models/Solution.model');
    const Industry = require('./src/models/Industry.model');

    const newCta = {
      title: "Still facing **issues** in your restaurant?\nTry our **free smart** Demo",
      desc: ""
    };

    const sRes = await Solution.updateMany({}, { $set: { ctaBlock: newCta } });
    console.log('Updated solutions count:', sRes.modifiedCount);

    const iRes = await Industry.updateMany({}, { $set: { ctaBlock: newCta } });
    console.log('Updated industries count:', iRes.modifiedCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateDb();
