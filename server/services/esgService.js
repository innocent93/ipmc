const ESGReport = require('../models/ESGReport');

exports.getAllReports = async (query) => {
  const { type, limit = 10, page = 1 } = query;
  const filter = { isPublished: true };
  if (type) filter.type = type;
  const [reports, count] = await Promise.all([
    ESGReport.find(filter).sort({ publishedAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    ESGReport.countDocuments(filter)
  ]);
  return { data: reports, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

exports.getReportById = async (id) => await ESGReport.findById(id);
exports.createReport = async (data) => await ESGReport.create(data);
exports.updateReport = async (id, data) => await ESGReport.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteReport = async (id) => await ESGReport.findByIdAndDelete(id);
