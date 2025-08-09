import express from 'express';
import { registerUser } from '../controllers/authController.js';

import { getCurrentUser } from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

import { loginUser } from '../controllers/authController.js';
import { updateUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getCurrentUser);


router.patch('/me', protect, updateUserProfile);

export default router;

