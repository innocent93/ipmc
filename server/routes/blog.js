const express = require('express');
const router = express.Router();
const { getAllPosts, getPostBySlug, getRelatedPosts, createPost, updatePost, deletePost } = require('../controllers/blogController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.get('/:slug/related', getRelatedPosts);
router.post('/', authenticate, authorize('admin', 'editor'), validate(schemas.blogPost), createPost);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(schemas.blogPost), updatePost);
router.delete('/:id', authenticate, authorize('admin'), deletePost);

module.exports = router;
