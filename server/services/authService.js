const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const logger = require('../utils/logger');

// Short-lived access token (used for API authorization) + long-lived
// refresh token (used only to silently mint new access tokens). This
// bounds how long a stolen access token stays useful — previously a
// single 30-day token was both, so theft of that one token gave 30 days
// of unrestricted access.
const ACCESS_TOKEN_EXPIRE = process.env.JWT_EXPIRE || '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const MAX_SESSIONS_PER_USER = 5; // oldest is dropped beyond this, so one account can't accumulate unlimited stale sessions

const signAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });

const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex');

// Adds a new session entry (one per logged-in device/browser) rather than
// overwriting a single field — this is what makes multi-device login work:
// logging in on a phone no longer invalidates an already-open desktop
// session. Expired sessions are pruned opportunistically on each call so
// the array doesn't grow unbounded.
const issueRefreshToken = async (user, userAgent) => {
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const now = Date.now();

  let sessions = (user.refreshSessions || []).filter((s) => s.expiresAt > now);
  sessions.push({
    tokenHash: hashToken(rawRefreshToken),
    userAgent: userAgent || 'Unknown device',
    createdAt: new Date(),
    expiresAt: new Date(now + REFRESH_TOKEN_TTL_MS),
  });
  if (sessions.length > MAX_SESSIONS_PER_USER) {
    sessions = sessions.slice(sessions.length - MAX_SESSIONS_PER_USER);
  }
  user.refreshSessions = sessions;
  await user.save({ validateBeforeSave: false });
  return rawRefreshToken;
};

exports.register = async (data) => {
  const { name, email, password, role } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const user = await User.create({ name, email, password, role: role || 'viewer' });
  const token = signAccessToken(user._id);
  const refreshToken = await issueRefreshToken(user);

  return {
    token,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  };
};

exports.login = async (email, password, userAgent) => {
  const user = await User.findOne({ email }).select('+password +refreshSessions');
  if (!user) throw new Error('Invalid credentials');
  if (!user.isActive) throw new Error('Account is deactivated');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  user.lastLogin = Date.now();
  const token = signAccessToken(user._id);
  const refreshToken = await issueRefreshToken(user, userAgent); // also saves lastLogin via the same .save() call
  return {
    token,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  };
};

// Exchanges a valid, unexpired refresh token for a new access token, and
// rotates just that one session's token (other active devices are left
// untouched). If someone presents a refresh token whose hash doesn't
// match any stored session, it's either expired-and-pruned or stolen —
// either way, reject rather than silently trusting it.
exports.refreshAccessToken = async (rawRefreshToken, userAgent) => {
  if (!rawRefreshToken) throw new Error('No refresh token provided');

  const tokenHash = hashToken(rawRefreshToken);
  const user = await User.findOne({ 'refreshSessions.tokenHash': tokenHash }).select('+refreshSessions');
  const session = user?.refreshSessions.find((s) => s.tokenHash === tokenHash);

  if (!user || !session || session.expiresAt < Date.now()) {
    throw new Error('Refresh token is invalid or has expired');
  }
  if (!user.isActive) throw new Error('Account is deactivated');

  // Drop the session being rotated before issuing its replacement, so
  // this device's old and new tokens never both validate at once.
  user.refreshSessions = user.refreshSessions.filter((s) => s.tokenHash !== tokenHash);
  const token = signAccessToken(user._id);
  const newRefreshToken = await issueRefreshToken(user, userAgent || session.userAgent);

  return {
    token,
    refreshToken: newRefreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  };
};

// Revokes only the session tied to the refresh token being logged out
// with — logging out on one device must not sign out every other device.
exports.revokeRefreshToken = async (userId, rawRefreshToken) => {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await User.findByIdAndUpdate(userId, { $pull: { refreshSessions: { tokenHash } } });
};

exports.listSessions = async (userId, currentRawRefreshToken) => {
  const user = await User.findById(userId).select('+refreshSessions');
  const currentHash = currentRawRefreshToken ? hashToken(currentRawRefreshToken) : null;
  const now = Date.now();
  return (user.refreshSessions || [])
    .filter((s) => s.expiresAt > now)
    .map((s) => ({
      id: s._id,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.tokenHash === currentHash,
    }));
};

exports.revokeSessionById = async (userId, sessionId) => {
  await User.findByIdAndUpdate(userId, { $pull: { refreshSessions: { _id: sessionId } } });
};

exports.getMe = async (userId) => {
  return await User.findById(userId).select('-password');
};

exports.updateProfile = async (userId, data) => {
  const updates = {};
  if (data.name) updates.name = data.name;
  if (data.avatar) updates.avatar = data.avatar;
  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: userId } });
    if (existing) throw new Error('Email already in use');
    updates.email = data.email;
  }
  return await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new Error('Current password is incorrect');
  user.password = newPassword;
  await user.save();
  return { success: true, message: 'Password updated successfully' };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('No user found with that email');

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Falls back to localhost only as a last resort \u2014 if ADMIN_URL isn't
  // set in production, that fallback would otherwise silently ship a
  // broken localhost link inside a real password-reset email.
  const adminUrl = process.env.ADMIN_URL || 'http://localhost:5174';
  if (!process.env.ADMIN_URL) {
    logger.warn('admin_url_not_configured', { message: 'ADMIN_URL is unset \u2014 reset email will link to localhost.' });
  }
  const resetURL = `${adminUrl}/admin/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetURL}" style="padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });

  return { success: true, message: 'Reset link sent to email' };
};

exports.resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } }).select('+refreshSessions');
  if (!user) throw new Error('Token is invalid or has expired');

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  // A password reset is a signal the account may have been compromised —
  // deliberately drop every other active session here rather than
  // preserving them, so a reset actually locks out anyone who had the
  // old password.
  user.refreshSessions = [];

  const token = signAccessToken(user._id);
  const refreshToken = await issueRefreshToken(user);
  return { token, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } };
};
