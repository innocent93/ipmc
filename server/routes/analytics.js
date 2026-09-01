const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentActivity, getMessageStats, getContentGrowth } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorize('admin', 'editor'), getDashboardStats);
router.get('/activity', authenticate, authorize('admin', 'editor'), getRecentActivity);
router.get('/messages', authenticate, authorize('admin', 'editor'), getMessageStats);
router.get('/growth', authenticate, authorize('admin', 'editor'), getContentGrowth);

module.exports = router;
