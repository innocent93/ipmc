const ContactMessage = require('../models/ContactMessage');
const { sendEmail, sendEmailInBackground } = require('../utils/emailService');

exports.submitContact = async (data, ipAddress) => {
  const { name, email, phone, company, subject, message, serviceInterest } = data;

  // Saving the message is the critical path \u2014 this must succeed before
  // we respond to the client. Email notifications are best-effort and must
  // never block or fail the response (see sendEmailInBackground below).
  const contactMessage = await ContactMessage.create({ name, email, phone, company, subject, message, serviceInterest, ipAddress });

  if (process.env.ADMIN_EMAIL) {
    sendEmailInBackground({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${subject}`,
      html: `<h2>New Contact</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`
    });
  }
  sendEmailInBackground({
    to: email,
    subject: 'Thank you for contacting IPMC',
    html: `<h2>Thank you, ${name}!</h2><p>We received your message about "${subject}" and will respond within 24-48 hours.</p>`
  });

  return contactMessage;
};

exports.getAllMessages = async (query) => {
  const { isRead, limit = 20, page = 1 } = query;
  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  const [messages, count] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    ContactMessage.countDocuments(filter)
  ]);
  return { data: messages, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

exports.getMessageById = async (id) => await ContactMessage.findById(id);

exports.replyToMessage = async (id, replyMessage) => {
  const message = await ContactMessage.findByIdAndUpdate(id, { isReplied: true, replyMessage, isRead: true }, { new: true });
  if (message) {
    await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject}`,
      html: `<p>Dear ${message.name},</p><p>${replyMessage}</p><p>Best regards,<br>IPMC Team</p>`
    });
  }
  return message;
};

exports.deleteMessage = async (id) => await ContactMessage.findByIdAndDelete(id);
exports.markAsRead = async (id) => await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
