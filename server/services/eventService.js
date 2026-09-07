const Event = require('../models/Event');

exports.getAllEvents = async (query) => {
  const { status = 'all', category, limit = 50, page = 1 } = query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (status === 'upcoming') filter.startDate = { $gte: new Date() };
  if (status === 'past') filter.startDate = { $lt: new Date() };

  const events = await Event.find(filter)
    .sort({ startDate: status === 'past' ? -1 : 1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('-rsvps.email -rsvps.phone'); // list view never exposes attendee PII, only counts (via the rsvpCount virtual)

  const total = await Event.countDocuments(filter);
  return { data: events, total, page: Number(page) };
};

exports.getEventBySlug = (slug) => Event.findOne({ slug, isActive: true }).select('-rsvps.email -rsvps.phone');

exports.createEvent = (data) => Event.create(data);
exports.updateEvent = (id, data) => Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteEvent = (id) => Event.findByIdAndDelete(id);

exports.rsvpToEvent = async (slug, rsvpData) => {
  const event = await Event.findOne({ slug, isActive: true });
  if (!event) throw new Error('Event not found');
  if (new Date(event.startDate) < new Date()) throw new Error('This event has already taken place');

  const alreadyRsvpd = event.rsvps.some((r) => r.email.toLowerCase() === rsvpData.email.toLowerCase());
  if (alreadyRsvpd) throw new Error('This email has already RSVP\u2019d for this event');

  const currentCount = event.rsvps.reduce((sum, r) => sum + r.guests, 0);
  const requestedGuests = Number(rsvpData.guests) || 1;
  if (event.capacity > 0 && currentCount + requestedGuests > event.capacity) {
    throw new Error(`Only ${Math.max(0, event.capacity - currentCount)} spot(s) remaining for this event`);
  }

  event.rsvps.push({ ...rsvpData, guests: requestedGuests });
  await event.save();
  return event;
};

// Admin-only: full RSVP list including contact details, for event planning.
exports.getEventRsvps = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');
  return event.rsvps;
};

exports.removeRsvp = async (eventId, rsvpId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');
  event.rsvps = event.rsvps.filter((r) => String(r._id) !== rsvpId);
  await event.save();
  return event;
};


exports.getAllEventsAdmin = async (query = {}) => {
  const { category, limit = 100, page = 1 } = query;
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);
  const safePage = Math.max(Number(page) || 1, 1);
  const filter = {};
  if (category) filter.category = category;
  const [events, total] = await Promise.all([
    Event.find(filter).sort({ startDate: 1 }).limit(safeLimit).skip((safePage - 1) * safeLimit),
    Event.countDocuments(filter),
  ]);
  return { data: events, total, page: safePage };
};
