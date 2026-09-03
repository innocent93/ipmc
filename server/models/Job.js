const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, required: true, unique: true, index: true },
  department: { type: String, required: true, index: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time', index: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  benefits: [{ type: String }],
  salaryRange: { type: String, default: '' },
  experienceLevel: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
  postedAt: { type: Date, default: Date.now, index: -1 },
  closingDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
