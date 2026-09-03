const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/teamController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.teamMember), createMember);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.teamMember), updateMember);
router.delete('/:id', authenticate, authorize('admin'), deleteMember);

module.exports = router;
