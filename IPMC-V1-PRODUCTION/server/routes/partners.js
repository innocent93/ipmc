const express = require('express');
const router = express.Router();
const { getAllPartners, createPartner, updatePartner, deletePartner } = require('../controllers/partnerController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', getAllPartners);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.partner), createPartner);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.partner), updatePartner);
router.delete('/:id', authenticate, authorize('admin'), deletePartner);

module.exports = router;
