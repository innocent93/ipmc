const express = require('express');
const router = express.Router();
const { submitContact, getAllMessages, getMessageById, replyToMessage, deleteMessage, markAsRead } = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validate, schemas } = require('../middleware/validation');

router.post('/', contactLimiter, validate(schemas.contact), submitContact);
router.get('/', authenticate, authorize('admin', 'editor'), getAllMessages);
router.get('/:id', authenticate, authorize('admin', 'editor'), getMessageById);
router.put('/:id/read', authenticate, authorize('admin', 'editor'), markAsRead);
router.put('/:id/reply', authenticate, authorize('admin', 'editor'), replyToMessage);
router.delete('/:id', authenticate, authorize('admin'), deleteMessage);

module.exports = router;
