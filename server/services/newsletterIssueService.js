const NewsletterIssue = require('../models/NewsletterIssue');
const Newsletter = require('../models/Newsletter');
const { sendEmail } = require('../utils/emailService');
const { newsletterIssueEmail } = require('../utils/emailTemplates');

exports.getPublishedArchive = async (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const filter = { isPublished: true };
  const issues = await NewsletterIssue.find(filter).sort({ sentAt: -1, createdAt: -1 }).limit(limit).skip((page - 1) * limit).select('-content');
  const total = await NewsletterIssue.countDocuments(filter);
  return { data: issues, total, page };
};

exports.getIssueBySlug = (slug) => NewsletterIssue.findOne({ slug, isPublished: true });
exports.getAllIssuesAdmin = () => NewsletterIssue.find().sort({ createdAt: -1 });
exports.createIssue = (data) => NewsletterIssue.create(data);
exports.updateIssue = (id, data) => NewsletterIssue.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteIssue = (id) => NewsletterIssue.findByIdAndDelete(id);

exports.sendIssue = async (id) => {
  const issue = await NewsletterIssue.findById(id);
  if (!issue) throw new Error('Newsletter issue not found');
  if (issue.sentAt) throw new Error('This issue has already been sent');

  const subscribers = await Newsletter.find({ isSubscribed: true }).select('email unsubscribeToken');
  let successful = 0;
  const now = new Date();

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${(process.env.CLIENT_URL || process.env.APP_URL || 'https://ipmc-ng.com').replace(/\/$/, '')}/newsletter/unsubscribe/${encodeURIComponent(subscriber.unsubscribeToken)}`;
    const email = newsletterIssueEmail({ subject: issue.subject, summary: issue.summary, content: issue.content, unsubscribeUrl });
    const result = await sendEmail({ to: subscriber.email, ...email });
    if (result.success) {
      successful += 1;
      await Newsletter.updateOne({ _id: subscriber._id }, { $set: { lastNewsletterSentAt: now } });
    }
  }

  issue.sentAt = now;
  issue.isPublished = true;
  await issue.save();
  return { issue, recipientCount: subscribers.length, successfulCount: successful };
};
