const Newsletter = require('../models/Newsletter');
const { sendEmailInBackground } = require('../utils/emailService');
const { welcomeEmail } = require('../utils/emailTemplates');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const unsubscribeUrl = (token) => `${(process.env.CLIENT_URL || process.env.APP_URL || 'https://ipmc-ng.com').replace(/\/$/, '')}/newsletter/unsubscribe/${encodeURIComponent(token)}`;

exports.subscribe = async (email, source = 'other') => {
  const normalizedEmail = normalizeEmail(email);
  let subscriber = await Newsletter.findOne({ email: normalizedEmail });
  const wasSubscribed = subscriber?.isSubscribed;

  if (subscriber) {
    if (wasSubscribed) throw new Error('Email already subscribed');
    subscriber.isSubscribed = true;
    subscriber.subscribedAt = new Date();
    subscriber.unsubscribedAt = null;
    subscriber.source = ['footer', 'newsletter-page', 'popup'].includes(source) ? source : 'other';
    if (!subscriber.unsubscribeToken) subscriber.unsubscribeToken = require('crypto').randomBytes(24).toString('hex');
    await subscriber.save();
  } else {
    subscriber = await Newsletter.create({
      email: normalizedEmail,
      source: ['footer', 'newsletter-page', 'popup'].includes(source) ? source : 'other',
    });
  }

  const emailContent = welcomeEmail({ unsubscribeUrl: unsubscribeUrl(subscriber.unsubscribeToken) });
  sendEmailInBackground({ to: normalizedEmail, ...emailContent });
  subscriber.welcomeEmailSentAt = new Date();
  await subscriber.save();
  return subscriber;
};

exports.unsubscribe = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const subscriber = await Newsletter.findOneAndUpdate(
    { email: normalizedEmail },
    { isSubscribed: false, unsubscribedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!subscriber) throw new Error('Email not found');
  return subscriber;
};

exports.unsubscribeByToken = async (token) => {
  const subscriber = await Newsletter.findOneAndUpdate(
    { unsubscribeToken: token },
    { isSubscribed: false, unsubscribedAt: new Date() },
    { new: true }
  );
  if (!subscriber) throw new Error('Invalid unsubscribe link');
  return subscriber;
};

exports.getAllSubscribers = async (includeUnsubscribed = true) => {
  const filter = includeUnsubscribed ? {} : { isSubscribed: true };
  return Newsletter.find(filter).sort({ isSubscribed: -1, subscribedAt: -1 });
};
