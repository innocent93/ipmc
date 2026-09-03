const mongoose = require('mongoose');

const esgSchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' },
  type: { 
    type: String, 
    enum: ['report', 'rating', 'news', 'insight'], 
    required: true,
    index: true
  },
  description: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  documentUrl: { type: String, default: '' },
  publishedAt: { type: Date, default: Date.now, index: -1 },
  isPublished: { type: Boolean, default: true, index: true },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('ESGReport', esgSchema);
