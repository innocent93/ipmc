const Newsletter = require('../models/Newsletter');
const { sendEmailInBackground } = require('../utils/emailService');

exports.subscribe = async (email) => {
  let subscriber = await Newsletter.findOne({ email });
  if (subscriber) {
    if (subscriber.isSubscribed) throw new Error('Email already subscribed');
    subscriber.isSubscribed = true;
    await subscriber.save();
  } else {
    subscriber = await Newsletter.create({ email });
  }
  // Saving the subscription is the critical path; the welcome email is
  // best-effort and must not block or fail the response.
  sendEmailInBackground({
    to: email,
    subject: 'Welcome to IPMC Newsletter',
    html: `<h2>Welcome!</h2><p>Thank you for subscribing to IPMC Insights.</p>`
  });
  return subscriber;
};

exports.unsubscribe = async (email) => {
  const subscriber = await Newsletter.findOneAndUpdate({ email }, { isSubscribed: false }, { new: true });
  if (!subscriber) throw new Error('Email not found');
  return subscriber;
};

exports.getAllSubscribers = async () => await Newsletter.find({ isSubscribed: true }).sort({ subscribedAt: -1 });
