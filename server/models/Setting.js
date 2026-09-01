const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  group: { 
    type: String, 
    enum: ['general', 'seo', 'social', 'contact', 'appearance'], 
    default: 'general',
    index: true 
  },
  description: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
