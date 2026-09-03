const express = require('express');
const router = express.Router();
const { getAllServices, getServiceBySlug, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.service), createService);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.service), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

module.exports = router;
