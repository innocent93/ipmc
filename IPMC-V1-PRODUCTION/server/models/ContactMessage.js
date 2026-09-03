const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  subject: { type: String, required: true },
  message: { type: String, required: true, minlength: 10 },
  serviceInterest: { type: String, default: '' },
  isRead: { type: Boolean, default: false, index: true },
  isReplied: { type: Boolean, default: false },
  replyMessage: { type: String, default: '' },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactSchema);
