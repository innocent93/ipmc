const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (query) => {
  const { category, featured, limit = 9, page = 1 } = query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (featured) filter.isFeatured = featured === 'true';

  const [posts, count] = await Promise.all([
    BlogPost.find(filter).sort({ publishedAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    BlogPost.countDocuments(filter)
  ]);

  return { data: posts, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

exports.getPostBySlug = async (slug) => {
  return await BlogPost.findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } }, { new: true });
};

exports.getRelatedPosts = async (slug) => {
  const post = await BlogPost.findOne({ slug });
  if (!post) throw new Error('Post not found');
  return await BlogPost.find({ category: post.category, slug: { $ne: slug }, isPublished: true }).limit(3).sort({ publishedAt: -1 });
};

exports.createPost = async (data) => await BlogPost.create(data);
exports.updatePost = async (id, data) => await BlogPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deletePost = async (id) => await BlogPost.findByIdAndDelete(id);


exports.getAllPostsAdmin = async (query = {}) => {
  const { category, featured, published, limit = 100, page = 1 } = query;
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);
  const safePage = Math.max(Number(page) || 1, 1);
  const filter = {};

  if (category) filter.category = category;
  if (featured !== undefined) filter.isFeatured = featured === 'true';
  if (published !== undefined) filter.isPublished = published === 'true';

  const [posts, count] = await Promise.all([
    BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit),
    BlogPost.countDocuments(filter),
  ]);

  return {
    data: posts,
    totalPages: Math.ceil(count / safeLimit),
    currentPage: safePage,
    total: count,
  };
};
