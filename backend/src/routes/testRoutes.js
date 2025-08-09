import express from 'express';
import { pingServer } from '../controllers/testController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/ping', protect, pingServer);

export default router;
