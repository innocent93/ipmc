const logger = require('./logger');

// Resend (https://resend.com) instead of raw SMTP: many hosts (Render's
// free/starter tiers among them) block outbound SMTP ports (25/465/587)
// entirely, which is why emails were silently never arriving even with
// correct SMTP credentials configured. Resend sends over plain HTTPS, so
// it isn't affected by that class of platform-level port blocking.
const RESEND_API_URL = 'https://api.resend.com/emails';
const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_dummy_replace_with_real_key');

if (!resendConfigured) {
  logger.warn('resend_not_configured', {
    message: 'RESEND_API_KEY is unset (or still the placeholder from .env.example) \u2014 emails will be skipped, not attempted.',
  });
}

exports.sendEmail = async ({ to, subject, html, text }) => {
  if (!resendConfigured) {
    logger.warn('email_skipped_resend_not_configured', { to, subject });
    return { success: false, error: 'Resend is not configured' };
  }

  const controller = new AbortController();
  // Bounded like the old SMTP timeout was — a slow/unreachable Resend API
  // call must fail fast rather than hang the request that triggered it
  // (see docs/DEPLOYMENT_FIX.md for why that mattered for the contact form).
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || `${process.env.APP_NAME || 'IPMC Nigeria'} <onboarding@resend.dev>`,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Resend API returned ${res.status}`);
    }

    logger.info('email_sent', { messageId: data.id, to, subject, provider: 'resend' });
    return { success: true, messageId: data.id };
  } catch (error) {
    const message = error.name === 'AbortError' ? 'Resend API request timed out' : error.message;
    logger.error('email_send_failed', { message, to, subject, provider: 'resend' });
    return { success: false, error: message };
  } finally {
    clearTimeout(timer);
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
