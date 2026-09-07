const express = require('express');
const router = express.Router();
const { getAllEvents, getAllEventsAdmin, getEventBySlug, createEvent, updateEvent, deleteEvent, rsvpToEvent, getEventRsvps, removeRsvp } = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { contactLimiter } = require('../middleware/rateLimiter'); // reused: same "a few submissions per window" shape fits RSVP spam prevention too

router.get('/', getAllEvents);
router.get('/admin/all', authenticate, authorize('admin', 'editor'), getAllEventsAdmin);
router.get('/:slug', getEventBySlug);
router.post('/:slug/rsvp', contactLimiter, validate(schemas.rsvp), rsvpToEvent);

router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.event), createEvent);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.event), updateEvent);
router.delete('/:id', authenticate, authorize('admin'), deleteEvent);
router.get('/:id/rsvps', authenticate, authorize('admin', 'editor'), getEventRsvps);
router.delete('/:id/rsvps/:rsvpId', authenticate, authorize('admin'), removeRsvp);

module.exports = router;
