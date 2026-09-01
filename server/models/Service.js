const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, required: true, unique: true, index: true },
  shortDescription: { type: String, required: true, maxlength: 200 },
  fullDescription: { type: String, required: true },
  icon: { type: String, default: 'settings' },
  image: { type: String, default: '' },
  features: [{ type: String }],
  benefits: [{ type: String }],
  category: { 
    type: String, 
    enum: ['project-management', 'financial', 'environmental', 'esg', 'assurance', 'fraud'],
    required: true,
    index: true
  },
  isActive: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
