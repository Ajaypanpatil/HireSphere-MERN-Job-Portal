import express from 'express'
import {createJob} from '../controllers/jobController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createJob);

export default router;