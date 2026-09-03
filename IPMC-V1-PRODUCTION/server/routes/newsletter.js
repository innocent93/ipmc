const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getAllSubscribers } = require('../controllers/newsletterController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.post('/subscribe', validate(schemas.newsletter), subscribe);
router.post('/unsubscribe', validate(schemas.newsletter), unsubscribe);
router.get('/subscribers', authenticate, authorize('admin', 'editor'), getAllSubscribers);

module.exports = router;
