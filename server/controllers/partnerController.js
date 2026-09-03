const partnerService = require('../services/partnerService');
const activityLogService = require('../services/activityLogService');

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await partnerService.getAllPartners(req.query);
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPartner = async (req, res) => {
  try {
    const partner = await partnerService.createPartner(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'Partner', partner._id, { name: partner.name }, req);
    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const partner = await partnerService.updatePartner(req.params.id, req.body);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'Partner', partner._id, { name: partner.name }, req);
    res.status(200).json({ success: true, data: partner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const partner = await partnerService.deletePartner(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'Partner', partner._id, { name: partner.name }, req);
    res.status(200).json({ success: true, message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
