import express from 'express'
import {createJob} from '../controllers/jobController.js';
import {protect} from '../middleware/authMiddleware.js';
import { listJobs } from '../controllers/jobController.js';
import { getJobById } from '../controllers/jobController.js';
import { updateJob } from '../controllers/jobController.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { deleteJob } from '../controllers/jobController.js';

const router = express.Router();

router.post('/create', protect, createJob);

router.get('/', listJobs);

router.get("/:id", getJobById);

router.patch('/:id', protect, authorizeRoles('recruiter'), updateJob);

router.delete('/:id', protect, authorizeRoles('recruiter'), deleteJob);


export default router;