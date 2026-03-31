import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  readStatus: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['Booking', 'System', 'Reminder'],
    default: 'System'
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
