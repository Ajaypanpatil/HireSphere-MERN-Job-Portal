import express from 'express'
import {createJob} from '../controllers/jobController.js';
import {protect} from '../middleware/authMiddleware.js';
import { listJobs } from '../controllers/jobController.js';

const router = express.Router();

router.post('/create', protect, createJob);

router.get('/', listJobs);


export default router;