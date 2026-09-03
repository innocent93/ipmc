const BlogPost = require('../models/BlogPost');
const ContactMessage = require('../models/ContactMessage');
const Newsletter = require('../models/Newsletter');
const Service = require('../models/Service');
const TeamMember = require('../models/TeamMember');
const ActivityLog = require('../models/ActivityLog');

exports.getDashboardStats = async () => {
  const [totalBlogs, totalServices, totalTeam, totalMessages, unreadMessages, totalSubscribers, totalViews] = await Promise.all([
    BlogPost.countDocuments({ isPublished: true }),
    Service.countDocuments({ isActive: true }),
    TeamMember.countDocuments({ isActive: true }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
    Newsletter.countDocuments({ isSubscribed: true }),
    BlogPost.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
  ]);

  return {
    totalBlogs,
    totalServices,
    totalTeam,
    totalMessages,
    unreadMessages,
    totalSubscribers,
    totalViews: totalViews[0]?.total || 0,
  };
};

exports.getRecentActivity = async (limit = 10) => {
  return await ActivityLog.find().sort({ createdAt: -1 }).limit(limit).populate('user', 'name email avatar');
};

exports.getMessageStats = async () => {
  const [total, unread, replied, thisMonth] = await Promise.all([
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
    ContactMessage.countDocuments({ isReplied: true }),
    ContactMessage.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
  ]);
  return { total, unread, replied, thisMonth };
};

exports.getContentGrowth = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [newBlogs, newServices, newTeam] = await Promise.all([
    BlogPost.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Service.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    TeamMember.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
  ]);
  return { newBlogs, newServices, newTeam };
};
