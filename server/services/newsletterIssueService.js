const NewsletterIssue = require('../models/NewsletterIssue');
const Newsletter = require('../models/Newsletter');
const { sendEmailInBackground } = require('../utils/emailService');

exports.getPublishedArchive = async (query) => {
  const { page = 1, limit = 12 } = query;
  const filter = { isPublished: true };
  const issues = await NewsletterIssue.find(filter)
    .sort({ sentAt: -1, createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('-content'); // list view: summary only, full content on the detail page
  const total = await NewsletterIssue.countDocuments(filter);
  return { data: issues, total, page: Number(page) };
};

exports.getIssueBySlug = (slug) => NewsletterIssue.findOne({ slug, isPublished: true });

exports.getAllIssuesAdmin = () => NewsletterIssue.find().sort({ createdAt: -1 });
exports.createIssue = (data) => NewsletterIssue.create(data);
exports.updateIssue = (id, data) => NewsletterIssue.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteIssue = (id) => NewsletterIssue.findByIdAndDelete(id);

// Sends the issue to every active subscriber and marks it sent+published.
// Runs as a background batch rather than blocking the admin's request —
// with a real subscriber list this could be hundreds of emails, and the
// admin shouldn't stare at a spinner for that.
exports.sendIssue = async (id) => {
  const issue = await NewsletterIssue.findById(id);
  if (!issue) throw new Error('Newsletter issue not found');
  if (issue.sentAt) throw new Error('This issue has already been sent');

  const subscribers = await Newsletter.find({ isSubscribed: true }).select('email');
  for (const sub of subscribers) {
    sendEmailInBackground({ to: sub.email, subject: issue.subject, html: issue.content });
  }

  issue.sentAt = new Date();
  issue.isPublished = true;
  await issue.save();
  return { issue, recipientCount: subscribers.length };
};
