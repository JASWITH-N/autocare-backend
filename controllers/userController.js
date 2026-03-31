import User from '../models/User.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all showroom owners
// @route   GET /api/users/owners
// @access  Private (Customers/Admins)
export const getShowrooms = async (req, res) => {
  try {
    const showrooms = await User.find({ role: 'owner', isVerified: true }).select('fullName email username _id');
    res.json(showrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new showroom explicitly (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createShowroom = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User (email or username) already exists' });
    }

    const showroom = await User.create({
      fullName,
      email,
      username,
      password,
      role: 'owner',
      isVerified: true // Admin-created showrooms are automatically verified
    });

    if (showroom) {
      res.status(201).json({
        _id: showroom._id,
        fullName: showroom.fullName,
        email: showroom.email,
        username: showroom.username,
        role: showroom.role
      });
    } else {
      res.status(400).json({ message: 'Failed to create showroom account' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
