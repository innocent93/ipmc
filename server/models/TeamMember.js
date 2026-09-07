const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, trim: true, lowercase: true },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0 },
  department: { 
    type: String, 
    enum: ['leadership', 'engineering', 'consulting', 'environmental', 'finance'],
    default: 'consulting',
    index: true
  },
}, { timestamps: true });

// Full-text search index (used by searchService.globalSearch).
teamSchema.index(
  { name: 'text', role: 'text', bio: 'text' },
  { weights: { name: 5, role: 3, bio: 1 }, name: 'team_text_index' }
);

module.exports = mongoose.model('TeamMember', teamSchema);
