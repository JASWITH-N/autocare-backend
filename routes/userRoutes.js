import express from 'express';
import { getAllUsers, getShowrooms, createShowroom } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetching valid showrooms is accessible to any protected user (Customers booking a service)
router.get('/owners', protect, getShowrooms);

// Admin only user management routes
router.route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, createShowroom);

export default router;
