const crypto = require('crypto');
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  isSubscribed: { type: Boolean, default: true, index: true },
  source: { type: String, enum: ['footer', 'newsletter-page', 'popup', 'other'], default: 'other', index: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date, default: null },
  lastNewsletterSentAt: { type: Date, default: null },
  welcomeEmailSentAt: { type: Date, default: null },
  unsubscribeToken: { type: String, unique: true, sparse: true, index: true, default: () => crypto.randomBytes(24).toString('hex') },
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
