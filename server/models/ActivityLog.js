const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  resource: { type: String, required: true },
  resourceId: { type: String },
  details: { type: Object, default: {} },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activitySchema);
