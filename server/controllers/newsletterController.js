const newsletterService = require('../services/newsletterService');

exports.subscribe = async (req, res) => {
  try {
    const subscriber = await newsletterService.subscribe(req.body.email, req.body.source);
    res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscriber });
  } catch (error) {
    res.status(error.message === 'Email already subscribed' ? 409 : 400).json({ success: false, message: error.message });
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

exports.unsubscribeByToken = async (req, res) => {
  try {
    await newsletterService.unsubscribeByToken(req.params.token);
    res.status(200).json({ success: true, message: 'You have been unsubscribed from IPMC Insights.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const includeUnsubscribed = req.query.includeUnsubscribed !== 'false';
    const subscribers = await newsletterService.getAllSubscribers(includeUnsubscribed);
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
