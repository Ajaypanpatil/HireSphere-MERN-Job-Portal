import express from 'express';
import { applyToJob, getApplicationsForRecruiter, getApplicationsForCandidate, updateApplicationStatus, checkApplication } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import { authorizeRoles } from '../middleware/roleMiddleware.js'; 

const router = express.Router();

// Candidate applies to a job
router.post('/apply', protect, authorizeRoles('candidate'), applyToJob);

// Recruiter views applications for their jobs
router.get('/job/:jobId', protect, authorizeRoles('recruiter'), getApplicationsForRecruiter);

// Candidate views their own applications
router.get('/me', protect, authorizeRoles('candidate'), getApplicationsForCandidate);

// Recruiter updates application status
router.patch('/:id', protect, authorizeRoles('recruiter'), updateApplicationStatus);

// Check if candidate has already applied for a job
router.get('/check/:jobId', protect, authorizeRoles('candidate'), checkApplication);


export default router;
