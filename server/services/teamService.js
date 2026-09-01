const TeamMember = require('../models/TeamMember');

exports.getAllMembers = async (query) => {
  const { department, limit = 20 } = query;
  const filter = { isActive: true };
  if (department) filter.department = department;
  return await TeamMember.find(filter).sort({ order: 1 }).limit(limit * 1);
};

exports.getMemberById = async (id) => await TeamMember.findById(id);
exports.createMember = async (data) => await TeamMember.create(data);
exports.updateMember = async (id, data) => await TeamMember.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteMember = async (id) => await TeamMember.findByIdAndDelete(id);
