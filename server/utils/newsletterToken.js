const crypto = require('crypto');

const getSecret = () => process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.JWT_SECRET || 'development-newsletter-secret';

exports.createUnsubscribeToken = (email) => {
  return crypto.createHmac('sha256', getSecret()).update(String(email).toLowerCase().trim()).digest('hex');
};

exports.getUnsubscribeUrl = (email) => {
  const base = (process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');
  return `${base}/newsletter/unsubscribe?token=${encodeURIComponent(exports.createUnsubscribeToken(email))}`;
};

exports.isValidUnsubscribeToken = (email, token) => {
  const expected = exports.createUnsubscribeToken(email);
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(token || ''), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
