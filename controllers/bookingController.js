import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res) => {
  const { serviceCenterId, vehicleType, serviceType, date, timeSlot } = req.body;

  try {
    const booking = new Booking({
      customer: req.user._id,
      serviceCenter: serviceCenterId,
      vehicleType,
      serviceType,
      date,
      timeSlot,
      status: 'Pending'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private (Customer)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('serviceCenter', 'fullName email username')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get owner's bookings
// @route   GET /api/bookings/owner
// @access  Private (Owner)
export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ serviceCenter: req.user._id })
      .populate('customer', 'fullName email username')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner/Admin)
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'owner' && booking.serviceCenter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('customer', 'fullName email username')
      .populate('serviceCenter', 'fullName email username')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
