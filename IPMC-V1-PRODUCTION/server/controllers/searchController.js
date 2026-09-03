const searchService = require('../services/searchService');

exports.globalSearch = async (req, res) => {
  try {
    const { q, limit } = req.query;
    const result = await searchService.globalSearch(q, parseInt(limit) || 10);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
