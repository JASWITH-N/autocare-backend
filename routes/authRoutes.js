import express from 'express';
import { registerUser, verifyOTP, authUser, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', authUser);
router.post('/google', googleLogin);

export default router;
