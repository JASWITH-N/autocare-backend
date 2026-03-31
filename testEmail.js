import sendEmail from './utils/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing email dispatch with:', process.env.SMTP_USER);

sendEmail({
  email: process.env.SMTP_USER, // send to self
  subject: 'Test Configuration',
  message: 'If you see this, Nodemailer is securely connected!'
}).then(() => {
  console.log('Test function execution complete (Check above for actual Message Sent logs)');
  process.exit();
}).catch(e => {
  console.error('Fatal execution error:', e);
  process.exit(1);
});
