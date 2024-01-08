import express from 'express';
import AuthController from '../Controllers/AuthenticationsController.js';

const router = express.Router();

// Local Strategy
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

// GOOGLE OAuth20 Strategy
router.get('/google', AuthController.initiateGoogleAuth);
router.get('/google/callback', AuthController.googleAuthCallback);
export default router;
