const mongoose = require('mongoose');

// Distinct from models/Newsletter.js, which only tracks subscriber email
// addresses. This model is the actual content of each newsletter issue
// that gets sent out — what the public archive page displays.
const newsletterIssueSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true },
  content: { type: String, required: true }, // full HTML body
  coverImage: { type: String, default: '' },
  sentAt: { type: Date, default: null }, // null until actually sent
  isPublished: { type: Boolean, default: false }, // visible in the public archive
}, { timestamps: true });

module.exports = mongoose.model('NewsletterIssue', newsletterIssueSchema);
