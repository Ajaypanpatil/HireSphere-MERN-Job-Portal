import express from 'express';
import {
  createJob,
  listJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create job
router.post('/create', protect, createJob);

// Public job listing
router.get('/', listJobs);

// Recruiter’s own jobs
router.get('/my-jobs', protect, authorizeRoles('recruiter'), getMyJobs);

// Single job details
router.get('/:id', getJobById);

// Update job
router.patch('/:id', protect, authorizeRoles('recruiter'), updateJob);

// Delete job
router.delete('/:id', protect, authorizeRoles('recruiter'), deleteJob);

export default router;
