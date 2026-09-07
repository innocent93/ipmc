const express = require('express');
const router = express.Router();
const { getAllJobs, getAllJobsAdmin, getJobBySlug, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { applyToJob, getApplicationsForJob, getAllApplications, updateApplicationStatus, deleteApplication } = require('../controllers/jobApplicationController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { contactLimiter } = require('../middleware/rateLimiter');

router.get('/', getAllJobs);
router.get('/admin/all', authenticate, authorize('admin', 'editor'), getAllJobsAdmin);
router.get('/applications', authenticate, authorize('admin', 'editor'), getAllApplications);
router.get('/:slug', getJobBySlug);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.job), createJob);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.job), updateJob);
router.delete('/:id', authenticate, authorize('admin'), deleteJob);

// Application tracking
router.post('/:jobId/apply', contactLimiter, validate(schemas.jobApplication), applyToJob);
router.get('/:jobId/applications', authenticate, authorize('admin', 'editor'), getApplicationsForJob);
router.put('/applications/:id', authenticate, authorize('admin', 'editor'), updateApplicationStatus);
router.delete('/applications/:id', authenticate, authorize('admin'), deleteApplication);

module.exports = router;
