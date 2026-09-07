const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');

exports.applyToJob = async (jobId, data) => {
  const job = await Job.findById(jobId);
  if (!job || !job.isActive) throw new Error('This position is no longer accepting applications');

  const existing = await JobApplication.findOne({ job: jobId, email: data.email.toLowerCase() });
  if (existing) throw new Error('You\u2019ve already applied to this position with this email address');

  return JobApplication.create({ job: jobId, ...data });
};

exports.getApplicationsForJob = (jobId) =>
  JobApplication.find({ job: jobId }).sort({ createdAt: -1 });

exports.getAllApplications = async (query) => {
  const { status, page = 1, limit = 20 } = query;
  const filter = status ? { status } : {};
  const applications = await JobApplication.find(filter)
    .populate('job', 'title department')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  const total = await JobApplication.countDocuments(filter);
  return { data: applications, total, page: Number(page) };
};

// The full workflow an application can move through — enforced here
// rather than left as a free-text field, so the admin UI can render a
// consistent pipeline (Kanban-style columns, status filters, etc).
const VALID_TRANSITIONS = ['submitted', 'under_review', 'shortlisted', 'interview', 'rejected', 'hired'];

exports.updateApplicationStatus = async (id, status, notes) => {
  if (!VALID_TRANSITIONS.includes(status)) throw new Error('Invalid application status');
  const update = { status };
  if (notes !== undefined) update.notes = notes;
  const application = await JobApplication.findByIdAndUpdate(id, update, { new: true }).populate('job', 'title');
  if (!application) throw new Error('Application not found');
  return application;
};

exports.deleteApplication = (id) => JobApplication.findByIdAndDelete(id);
