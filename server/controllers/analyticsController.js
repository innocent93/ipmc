const analyticsService = require('../services/analyticsService');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await analyticsService.getRecentActivity(req.query.limit || 10);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessageStats = async (req, res) => {
  try {
    const stats = await analyticsService.getMessageStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContentGrowth = async (req, res) => {
  try {
    const growth = await analyticsService.getContentGrowth();
    res.status(200).json({ success: true, data: growth });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
