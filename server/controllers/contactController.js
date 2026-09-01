const contactService = require('../services/contactService');
const activityLogService = require('../services/activityLogService');

exports.submitContact = async (req, res) => {
  try {
    const contactMessage = await contactService.submitContact(req.body, req.ip);
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contactMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const result = await contactService.getAllMessages(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await contactService.getMessageById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyToMessage = async (req, res) => {
  try {
    const message = await contactService.replyToMessage(req.params.id, req.body.replyMessage);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    await activityLogService.logActivity(req.user.id, 'REPLY', 'ContactMessage', message._id, {}, req);
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await contactService.deleteMessage(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'ContactMessage', message._id, {}, req);
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await contactService.markAsRead(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
