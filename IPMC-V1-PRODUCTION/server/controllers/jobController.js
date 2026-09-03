const jobService = require('../services/jobService');
const activityLogService = require('../services/activityLogService');

exports.getAllJobs = async (req, res) => {
  try {
    const result = await jobService.getAllJobs(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobBySlug = async (req, res) => {
  try {
    const job = await jobService.getJobBySlug(req.params.slug);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'Job', job._id, { title: job.title }, req);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'Job', job._id, { title: job.title }, req);
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'Job', job._id, { title: job.title }, req);
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
