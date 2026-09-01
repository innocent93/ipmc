const nodemailer = require('nodemailer');
const logger = require('./logger');

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

if (!smtpConfigured) {
  logger.warn('smtp_not_configured', {
    message: 'SMTP_HOST/SMTP_USER/SMTP_PASS are not set \u2014 emails will be skipped, not attempted.',
  });
}

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Without these, an unreachable/misconfigured SMTP host causes
      // sendMail() to hang indefinitely instead of failing \u2014 which in
      // turn hangs any request that awaits it, with no error and no log
      // line (since the HTTP response never finishes). Bounding every
      // stage of the SMTP handshake turns a silent hang into a fast,
      // logged failure.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    })
  : null;

exports.sendEmail = async ({ to, subject, html, text }) => {
  if (!smtpConfigured) {
    logger.warn('email_skipped_smtp_not_configured', { to, subject });
    return { success: false, error: 'SMTP not configured' };
  }
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'IPMC Nigeria'}" <${process.env.SMTP_USER}>`,
      to, subject, html, text,
    });
    logger.info('email_sent', { messageId: info.messageId, to, subject });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('email_send_failed', { message: error.message, to, subject });
    return { success: false, error: error.message };
  }
};

// Fire-and-forget helper for call sites where email is a best-effort
// notification, not something the client's response should wait on (e.g.
// "your message was saved" shouldn't hang on "and the email confirming it
// was sent"). Failures are logged, never thrown, and never bubble up to
// crash or hang the calling request.
exports.sendEmailInBackground = ({ to, subject, html, text }) => {
  exports.sendEmail({ to, subject, html, text }).catch((error) => {
    logger.error('email_background_send_failed', { message: error.message, to, subject });
  });
};
