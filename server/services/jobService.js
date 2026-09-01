const Job = require('../models/Job');

exports.getAllJobs = async (query) => {
  const { department, type, limit = 10, page = 1 } = query;
  const filter = { isActive: true };
  if (department) filter.department = department;
  if (type) filter.type = type;
  const [jobs, count] = await Promise.all([
    Job.find(filter).sort({ postedAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Job.countDocuments(filter)
  ]);
  return { data: jobs, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

exports.getJobBySlug = async (slug) => await Job.findOne({ slug, isActive: true });
exports.createJob = async (data) => await Job.create(data);
exports.updateJob = async (id, data) => await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteJob = async (id) => await Job.findByIdAndDelete(id);
