const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true
  },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { 
    type: String, 
    enum: ['admin', 'editor', 'viewer'], 
    default: 'viewer',
    index: true
  },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
  lastLogin: { type: Date },
  passwordChangedAt: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  // Multi-device refresh sessions: one entry per active login (browser/
  // device), instead of a single field that would silently sign out
  // every other device on each new login or refresh. Only hashes are
  // stored, same as the password. Each entry rotates independently.
  refreshSessions: {
    type: [{
      tokenHash: { type: String, required: true },
      userAgent: { type: String, default: 'Unknown device' },
      createdAt: { type: Date, default: Date.now },
      expiresAt: { type: Date, required: true },
    }],
    select: false,
    default: [],
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  this.resetPasswordToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
