const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: '' },
  guests: { type: Number, default: 1, min: 1, max: 10 },
  rsvpAt: { type: Date, default: Date.now },
}, { _id: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['conference', 'workshop', 'seminar', 'training'], default: 'conference' },
  coverImage: { type: String, default: '' },
  location: { type: String, required: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date },
  capacity: { type: Number, default: 0 }, // 0 = unlimited
  isActive: { type: Boolean, default: true },
  rsvps: { type: [rsvpSchema], default: [] },
}, { timestamps: true });

eventSchema.virtual('rsvpCount').get(function () {
  return this.rsvps.reduce((sum, r) => sum + r.guests, 0);
});
eventSchema.virtual('isFull').get(function () {
  return this.capacity > 0 && this.rsvpCount >= this.capacity;
});
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
