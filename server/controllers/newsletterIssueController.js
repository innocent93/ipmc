const newsletterIssueService = require('../services/newsletterIssueService');
const activityLogService = require('../services/activityLogService');

exports.getPublishedArchive = async (req, res) => {
  try {
    const result = await newsletterIssueService.getPublishedArchive(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIssueBySlug = async (req, res) => {
  try {
    const issue = await newsletterIssueService.getIssueBySlug(req.params.slug);
    if (!issue) return res.status(404).json({ success: false, message: 'Newsletter issue not found' });
    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllIssuesAdmin = async (req, res) => {
  try {
    const issues = await newsletterIssueService.getAllIssuesAdmin();
    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const issue = await newsletterIssueService.createIssue(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'NewsletterIssue', issue._id, { subject: issue.subject }, req);
    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const issue = await newsletterIssueService.updateIssue(req.params.id, req.body);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    await newsletterIssueService.deleteIssue(req.params.id);
    res.status(200).json({ success: true, message: 'Issue deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendIssue = async (req, res) => {
  try {
    const result = await newsletterIssueService.sendIssue(req.params.id);
    await activityLogService.logActivity(req.user.id, 'SEND', 'NewsletterIssue', result.issue._id, { recipientCount: result.recipientCount }, req);
    res.status(200).json({ success: true, message: `Sent to ${result.recipientCount} subscribers`, data: result.issue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
