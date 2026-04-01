import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const result = await User.deleteMany({ role: { $ne: 'admin' } });
      console.log(`SUCCESS: Deleted ${result.deletedCount} old test users from Atlast.`);
      process.exit();
    } catch (error) {
      console.error('ERROR:', error);
      process.exit(1);
    }
  });
