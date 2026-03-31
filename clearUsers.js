import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/vmsb')
  .then(async () => {
    try {
      const result = await User.deleteMany({ role: { $ne: 'admin' } });
      console.log(`SUCCESS: Deleted ${result.deletedCount} old test users.`);
      process.exit();
    } catch (error) {
      console.error('ERROR:', error);
      process.exit(1);
    }
  });
