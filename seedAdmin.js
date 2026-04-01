import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/vmsb')
  .then(async () => {
    try {
      // Check if admin exists
      const adminExists = await User.findOne({ email: 'admin@autocare.com' });
      
      if (!adminExists) {
        await User.create({
          fullName: 'System Administrator',
          email: 'admin@autocare.com',
          username: 'admin',
          password: 'password123', // Will be hashed by pre-save middleware
          role: 'admin',
          isVerified: true
        });
        console.log('SUCCESS: Admin user created!');
      } else {
        console.log('INFO: Admin user already exists. Email: admin@autocare.com | Password: password123');
      }
      process.exit();
    } catch (error) {
      console.error('ERROR creating admin:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
