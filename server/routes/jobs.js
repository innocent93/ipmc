const express = require('express');
const router = express.Router();
const { getAllJobs, getJobBySlug, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', getAllJobs);
router.get('/:slug', getJobBySlug);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.job), createJob);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.job), updateJob);
router.delete('/:id', authenticate, authorize('admin'), deleteJob);

module.exports = router;
