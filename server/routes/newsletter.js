const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getAllSubscribers } = require('../controllers/newsletterController');
const {
  getPublishedArchive, getIssueBySlug, getAllIssuesAdmin,
  createIssue, updateIssue, deleteIssue, sendIssue,
} = require('../controllers/newsletterIssueController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.post('/subscribe', validate(schemas.newsletter), subscribe);
router.post('/unsubscribe', validate(schemas.newsletter), unsubscribe);
router.get('/subscribers', authenticate, authorize('admin', 'editor'), getAllSubscribers);

// Newsletter archive — the actual sent-issue content, distinct from the
// subscriber list above.
router.get('/archive', getPublishedArchive);
router.get('/archive/:slug', getIssueBySlug);
router.get('/issues', authenticate, authorize('admin', 'editor'), getAllIssuesAdmin);
router.post('/issues', authenticate, authorize('admin', 'editor'), createIssue);
router.put('/issues/:id', authenticate, authorize('admin', 'editor'), updateIssue);
router.delete('/issues/:id', authenticate, authorize('admin'), deleteIssue);
router.post('/issues/:id/send', authenticate, authorize('admin'), sendIssue);

module.exports = router;
