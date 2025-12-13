const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nocap');
    console.log('Connected to MongoDB');

    // Delete all users (this removes the admin lock)
    await User.deleteMany({});
    console.log('✓ All users deleted - registration is now unlocked');
    
    // Also clear analysis history if you want a fresh start
    const Analysis = require('./routes/detection').Analysis;
    await Analysis.deleteMany({});
    console.log('✓ Analysis history cleared');

    console.log('\n🎉 Database reset complete!');
    console.log('You can now create a new admin account through the frontend.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();