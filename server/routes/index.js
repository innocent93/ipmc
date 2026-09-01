const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);

router.use('/auth', require('./auth'));
router.use('/blog', require('./blog'));
router.use('/contact', require('./contact'));
router.use('/esg', require('./esg'));
router.use('/jobs', require('./jobs'));
router.use('/newsletter', require('./newsletter'));
router.use('/partners', require('./partners'));
router.use('/services', require('./services'));
router.use('/team', require('./team'));
router.use('/search', require('./search'));
router.use('/settings', require('./settings'));
router.use('/analytics', require('./analytics'));
router.use('/upload', require('./upload'));

module.exports = router;
