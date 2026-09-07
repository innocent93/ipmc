const eventService = require('../services/eventService');
const activityLogService = require('../services/activityLogService');

exports.getAllEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventBySlug = async (req, res) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'Event', event._id, { title: event.title }, req);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'Event', event._id, { title: event.title }, req);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await eventService.deleteEvent(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'Event', event._id, { title: event.title }, req);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rsvpToEvent = async (req, res) => {
  try {
    const event = await eventService.rsvpToEvent(req.params.slug, req.body);
    res.status(201).json({ success: true, message: 'RSVP confirmed! We look forward to seeing you.', data: { rsvpCount: event.rsvpCount } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getEventRsvps = async (req, res) => {
  try {
    const rsvps = await eventService.getEventRsvps(req.params.id);
    res.status(200).json({ success: true, data: rsvps });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeRsvp = async (req, res) => {
  try {
    await eventService.removeRsvp(req.params.id, req.params.rsvpId);
    res.status(200).json({ success: true, message: 'RSVP removed' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
