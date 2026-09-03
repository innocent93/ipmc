const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'Contributor' }
  },
  category: { 
    type: String, 
    enum: ['esg', 'financial', 'project-management', 'environmental', 'industry-news', 'insights'],
    required: true,
    index: true
  },
  tags: [{ type: String, index: true }],
  readTime: { type: Number, default: 5 },
  isPublished: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  views: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now, index: -1 },
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogSchema);
