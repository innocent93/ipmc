const express = require('express');
const router = express.Router();
const { getAllSettings, getPublicSettings, getSetting, setSetting, bulkUpdate, deleteSetting } = require('../controllers/settingsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/public', getPublicSettings);
router.get('/:key', getSetting);
router.get('/', authenticate, authorize('admin'), getAllSettings);
router.post('/', authenticate, authorize('admin'), setSetting);
router.put('/bulk', authenticate, authorize('admin'), bulkUpdate);
router.delete('/:key', authenticate, authorize('admin'), deleteSetting);

module.exports = router;
