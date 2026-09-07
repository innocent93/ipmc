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


exports.getAllMembersAdmin = async (query = {}) => {
  const { department, limit = 100, page = 1 } = query;
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);
  const safePage = Math.max(Number(page) || 1, 1);
  const filter = {};
  if (department) filter.department = department;
  const [members, count] = await Promise.all([
    TeamMember.find(filter).sort({ order: 1, createdAt: -1 }).limit(safeLimit).skip((safePage - 1) * safeLimit),
    TeamMember.countDocuments(filter),
  ]);
  return { data: members, totalPages: Math.ceil(count / safeLimit), currentPage: safePage, total: count };
};
