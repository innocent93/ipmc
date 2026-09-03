const blogService = require('../services/blogService');
const activityLogService = require('../services/activityLogService');

exports.getAllPosts = async (req, res) => {
  try {
    const result = await blogService.getAllPosts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRelatedPosts = async (req, res) => {
  try {
    const related = await blogService.getRelatedPosts(req.params.slug);
    res.status(200).json({ success: true, data: related });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await blogService.createPost(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'BlogPost', post._id, { title: post.title }, req);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await blogService.updatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'BlogPost', post._id, { title: post.title }, req);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await blogService.deletePost(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'BlogPost', post._id, { title: post.title }, req);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
