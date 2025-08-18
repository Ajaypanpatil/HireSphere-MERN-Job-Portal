import express from 'express';
import { applyToJob, getApplicationsForRecruiter, getApplicationsForCandidate, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import { authorizeRoles } from '../middleware/roleMiddleware.js'; 

const router = express.Router();

// Candidate applies to a job
router.post('/apply', protect, authorizeRoles('candidate'), applyToJob);

// Recruiter views applications for their jobs
router.get('/recruiter', protect, authorizeRoles('recruiter'), getApplicationsForRecruiter);

// Candidate views their own applications
router.get('/me', protect, authorizeRoles('candidate'), getApplicationsForCandidate);

// Recruiter updates application status
router.patch('/:id', protect, authorizeRoles('recruiter'), updateApplicationStatus);

export default router;
