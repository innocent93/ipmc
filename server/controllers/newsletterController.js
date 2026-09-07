const newsletterService = require('../services/newsletterService');

exports.subscribe = async (req, res) => {
  try {
    const result = await newsletterService.subscribe(req.body.email, req.body.source);
    res.status(result.alreadySubscribed ? 200 : 201).json({ success: true, message: result.alreadySubscribed ? 'Email is already subscribed' : 'Subscribed successfully', data: result.subscriber });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const subscriber = await newsletterService.unsubscribe(req.body.email);
    res.status(200).json({ success: true, message: 'Unsubscribed successfully', data: subscriber });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const includeUnsubscribed = req.query.includeUnsubscribed === 'true';
    const subscribers = await newsletterService.getAllSubscribers({ includeUnsubscribed });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.unsubscribeByToken = async (req, res) => {
  try {
    await newsletterService.unsubscribeByToken(req.params.token);
    res.status(200).json({ success: true, message: 'You have been unsubscribed successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
