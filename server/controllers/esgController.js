const esgService = require('../services/esgService');
const activityLogService = require('../services/activityLogService');

exports.getAllReports = async (req, res) => {
  try {
    const result = await esgService.getAllReports(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await esgService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReport = async (req, res) => {
  try {
    const report = await esgService.createReport(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'ESGReport', report._id, { title: report.title }, req);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await esgService.updateReport(req.params.id, req.body);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'ESGReport', report._id, { title: report.title }, req);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await esgService.deleteReport(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'ESGReport', report._id, { title: report.title }, req);
    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
