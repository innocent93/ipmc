const BlogPost = require('../models/BlogPost');
const Service = require('../models/Service');
const ESGReport = require('../models/ESGReport');
const Job = require('../models/Job');
const TeamMember = require('../models/TeamMember');

exports.globalSearch = async (q, limit = 10) => {
  if (!q || q.trim().length < 2) throw new Error('Search query must be at least 2 characters');
  const regex = new RegExp(q.trim(), 'i');

  const [blogs, services, esg, jobs, team] = await Promise.all([
    BlogPost.find({ isPublished: true, $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] }).limit(limit).select('title slug excerpt coverImage category publishedAt'),
    Service.find({ isActive: true, $or: [{ title: regex }, { shortDescription: regex }] }).limit(limit).select('title slug shortDescription icon category'),
    ESGReport.find({ isPublished: true, $or: [{ title: regex }, { description: regex }] }).limit(limit).select('title type description coverImage publishedAt'),
    Job.find({ isActive: true, $or: [{ title: regex }, { description: regex }] }).limit(limit).select('title slug department location type'),
    TeamMember.find({ isActive: true, $or: [{ name: regex }, { role: regex }, { bio: regex }] }).limit(limit).select('name role title image department'),
  ]);

  return { blogs, services, esg, jobs, team, total: blogs.length + services.length + esg.length + jobs.length + team.length };
};
