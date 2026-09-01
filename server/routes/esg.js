const express = require('express');
const router = express.Router();
const { getAllReports, getReportById, createReport, updateReport, deleteReport } = require('../controllers/esgController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.esgReport), createReport);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.esgReport), updateReport);
router.delete('/:id', authenticate, authorize('admin'), deleteReport);

module.exports = router;
