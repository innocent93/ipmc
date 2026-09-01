const settingsService = require('../services/settingsService');
const activityLogService = require('../services/activityLogService');

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await settingsService.getAllSettings(req.query.group);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await settingsService.getPublicSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSetting = async (req, res) => {
  try {
    const value = await settingsService.getSetting(req.params.key);
    res.status(200).json({ success: true, data: { key: req.params.key, value } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.setSetting = async (req, res) => {
  try {
    const setting = await settingsService.setSetting(req.body.key, req.body.value, req.body.group);
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'Setting', setting._id, { key: setting.key }, req);
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const settings = await settingsService.bulkUpdate(req.body.settings);
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'Setting', null, { count: settings.length }, req);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    await settingsService.deleteSetting(req.params.key);
    await activityLogService.logActivity(req.user.id, 'DELETE', 'Setting', null, { key: req.params.key }, req);
    res.status(200).json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
