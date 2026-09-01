const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  isSubscribed: { type: Boolean, default: true, index: true },
  subscribedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
