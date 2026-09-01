const serviceService = require('../services/serviceService');
const activityLogService = require('../services/activityLogService');

exports.getAllServices = async (req, res) => {
  try {
    const result = await serviceService.getAllServices(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await serviceService.getServiceBySlug(req.params.slug);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'Service', service._id, { title: service.title }, req);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'Service', service._id, { title: service.title }, req);
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await serviceService.deleteService(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'Service', service._id, { title: service.title }, req);
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
