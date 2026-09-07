const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  isSubscribed: { type: Boolean, default: true, index: true },
  source: { type: String, enum: ['footer', 'newsletter-page', 'import', 'admin', 'other'], default: 'footer', index: true },
  subscribedAt: { type: Date, default: Date.now, index: true },
  resubscribedAt: { type: Date, default: null },
  unsubscribedAt: { type: Date, default: null },
  welcomeEmailSentAt: { type: Date, default: null },
  lastNewsletterSentAt: { type: Date, default: null },
  unsubscribeTokenHash: { type: String, index: true },
}, { timestamps: true });

newsletterSchema.index({ isSubscribed: 1, subscribedAt: -1 });
newsletterSchema.index({ unsubscribeTokenHash: 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
