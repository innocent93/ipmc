const jobApplicationService = require('../services/jobApplicationService');
const { sendEmailInBackground } = require('../utils/emailService');

exports.applyToJob = async (req, res) => {
  try {
    const application = await jobApplicationService.applyToJob(req.params.jobId, req.body);
    sendEmailInBackground({
      to: application.email,
      subject: 'Application Received \u2014 IPMC Nigeria',
      html: `<h2>Thank you, ${application.name}!</h2><p>We've received your application and will be in touch as your application progresses.</p>`,
    });
    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await jobApplicationService.getApplicationsForJob(req.params.jobId);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const result = await jobApplicationService.getAllApplications(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await jobApplicationService.updateApplicationStatus(req.params.id, req.body.status, req.body.notes);
    // Status changes are exactly the moments an applicant cares about
    // hearing from you — but only for the genuinely notable transitions,
    // not every internal note edit.
    if (['shortlisted', 'interview', 'rejected', 'hired'].includes(req.body.status)) {
      const statusMessages = {
        shortlisted: 'You\u2019ve been shortlisted for the next stage.',
        interview: 'We\u2019d like to invite you for an interview \u2014 our team will reach out with details.',
        rejected: 'After careful review, we\u2019ve decided to move forward with other candidates for this role.',
        hired: 'Congratulations \u2014 welcome to the team! We\u2019ll be in touch with next steps.',
      };
      sendEmailInBackground({
        to: application.email,
        subject: `Application Update \u2014 ${application.job?.title || 'IPMC Nigeria'}`,
        html: `<h2>Hi ${application.name},</h2><p>${statusMessages[req.body.status]}</p>`,
      });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    await jobApplicationService.deleteApplication(req.params.id);
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
