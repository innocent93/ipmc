const ActivityLog = require('../models/ActivityLog');

exports.logActivity = async (userId, action, resource, resourceId, details = {}, req) => {
  return await ActivityLog.create({
    user: userId,
    action,
    resource,
    resourceId,
    details,
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
  });
};

exports.getActivities = async (query) => {
  const { user, action, limit = 20, page = 1 } = query;
  const filter = {};
  if (user) filter.user = user;
  if (action) filter.action = action;
  const [activities, count] = await Promise.all([
    ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit).populate('user', 'name email avatar'),
    ActivityLog.countDocuments(filter)
  ]);
  return { data: activities, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};
