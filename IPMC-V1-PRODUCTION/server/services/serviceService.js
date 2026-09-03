const Service = require('../models/Service');

exports.getAllServices = async (query) => {
  const { category, limit = 10, page = 1 } = query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const [services, count] = await Promise.all([
    Service.find(filter).sort({ order: 1, createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Service.countDocuments(filter)
  ]);
  return { data: services, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

exports.getServiceBySlug = async (slug) => await Service.findOne({ slug, isActive: true });
exports.createService = async (data) => await Service.create(data);
exports.updateService = async (id, data) => await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteService = async (id) => await Service.findByIdAndDelete(id);
