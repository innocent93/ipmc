const Partner = require('../models/Partner');

exports.getAllPartners = async (query) => {
  const { category } = query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  return await Partner.find(filter).sort({ order: 1 });
};

exports.createPartner = async (data) => await Partner.create(data);
exports.updatePartner = async (id, data) => await Partner.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deletePartner = async (id) => await Partner.findByIdAndDelete(id);
