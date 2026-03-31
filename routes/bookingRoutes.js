import express from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookings
} from '../controllers/bookingController.js';
import { protect, admin, owner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.route('/mybookings').get(protect, getMyBookings);
router.route('/owner').get(protect, owner, getOwnerBookings);
router.route('/:id/status').put(protect, owner, updateBookingStatus);

export default router;
