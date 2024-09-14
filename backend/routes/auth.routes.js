import express from "express";
import { signup, login, logout, getAuthenticatedUser, verifySignup, setPassword, resendVerificationCode } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Existing routes
router.post('/signup', signup);
router.post('/verify', verifySignup);
router.post('/set-password', setPassword);
router.post('/resend-verification-code', resendVerificationCode); // Register the new route here
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getAuthenticatedUser);

export default router;
