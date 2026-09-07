const Newsletter = require('../models/Newsletter');
const { sendEmailInBackground } = require('../utils/emailService');
const emailTemplates = require('../utils/emailTemplates');
const { createUnsubscribeToken, isValidUnsubscribeToken } = require('../utils/newsletterToken');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

exports.subscribe = async (email, source = 'footer') => {
  const normalizedEmail = normalizeEmail(email);
  const safeSource = ['footer', 'newsletter-page', 'import', 'admin', 'other'].includes(source) ? source : 'other';
  let subscriber = await Newsletter.findOne({ email: normalizedEmail });

  if (subscriber?.isSubscribed) {
    return { subscriber, alreadySubscribed: true };
  }

  const now = new Date();
  if (subscriber) {
    subscriber.isSubscribed = true;
    subscriber.source = safeSource;
    subscriber.resubscribedAt = now;
    subscriber.unsubscribedAt = null;
    subscriber.subscribedAt = now;
    subscriber.welcomeEmailSentAt = null;
    subscriber.unsubscribeTokenHash = createUnsubscribeToken(normalizedEmail);
    await subscriber.save();
  } else {
    subscriber = await Newsletter.create({ email: normalizedEmail, source: safeSource, subscribedAt: now, unsubscribeTokenHash: createUnsubscribeToken(normalizedEmail) });
  }

  const template = emailTemplates.welcome(normalizedEmail);
  sendEmailInBackground({ to: normalizedEmail, ...template, onSuccess: async () => {
    await Newsletter.updateOne({ _id: subscriber._id }, { $set: { welcomeEmailSentAt: new Date() } });
  }});

  return { subscriber, alreadySubscribed: false };
};

exports.unsubscribe = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const subscriber = await Newsletter.findOne({ email: normalizedEmail });
  if (!subscriber) throw new Error('Email not found');
  if (subscriber.isSubscribed) {
    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
  }
  return subscriber;
};

exports.unsubscribeByToken = async (token) => {
  const normalizedToken = String(token || '').trim().toLowerCase();
  let subscriber = await Newsletter.findOne({ unsubscribeTokenHash: normalizedToken });
  // Backward compatibility for subscribers created before the token field was added.
  if (!subscriber) {
    const subscribers = await Newsletter.find({ unsubscribeTokenHash: { $exists: false } }).select('email isSubscribed unsubscribeTokenHash');
    subscriber = subscribers.find((item) => isValidUnsubscribeToken(item.email, normalizedToken));
    if (subscriber) {
      subscriber.unsubscribeTokenHash = createUnsubscribeToken(subscriber.email);
    }
  }
  if (!subscriber) throw new Error('Invalid unsubscribe link');
  if (subscriber.isSubscribed) {
    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
  }
  return subscriber;
};

exports.getAllSubscribers = async ({ includeUnsubscribed = false } = {}) => {
  const filter = includeUnsubscribed ? {} : { isSubscribed: true };
  return Newsletter.find(filter).sort({ subscribedAt: -1 });
};
