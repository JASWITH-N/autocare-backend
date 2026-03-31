import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user (Unverified)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { fullName, email, username, password, role } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      fullName,
      email,
      username,
      password,
      role: role || 'customer',
      otp,
      isVerified: false
    });

    if (user) {
      const message = `Your OTP for AutoCare App verification is: ${otp}`;
      
      // Fire-and-forget: Do not await this, so the frontend doesn't hang if SMTP times out
      sendEmail({
        email: user.email,
        subject: 'AutoCare App Account Verification',
        message,
      });

      res.status(201).json({
        message: 'User registered. Please check email for OTP.',
        userId: user._id,
        email: user.email
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user via Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { credential, client_id, role } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || client_id,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.isVerified) user.isVerified = true;
      if (!user.googleId) user.googleId = sub;
      await user.save();
    } else {
      const username = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000);
      user = await User.create({
        fullName: name,
        email,
        username,
        googleId: sub,
        role: role || 'customer',
        isVerified: true
      });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Google Authentication Failed' });
  }
};
