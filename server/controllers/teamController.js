const teamService = require('../services/teamService');
const activityLogService = require('../services/activityLogService');

exports.getAllMembers = async (req, res) => {
  try {
    const members = await teamService.getAllMembers(req.query);
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await teamService.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const member = await teamService.createMember(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'TeamMember', member._id, { name: member.name }, req);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await teamService.updateMember(req.params.id, req.body);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'TeamMember', member._id, { name: member.name }, req);
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await teamService.deleteMember(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'TeamMember', member._id, { name: member.name }, req);
    res.status(200).json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
