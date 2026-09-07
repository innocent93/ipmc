const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const appUrl = (process.env.CLIENT_URL || process.env.APP_URL || 'https://ipmc-ng.com').replace(/\/$/, '');

const baseTemplate = ({ preheader = '', eyebrow = 'IPMC INSIGHTS', title, intro = '', body, ctaLabel, ctaUrl, unsubscribeUrl }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#17324d;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6f8;padding:28px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(23,50,77,.08);">
<tr><td style="background:#102f4b;padding:26px 34px;"><div style="font-size:28px;line-height:1;font-weight:800;letter-spacing:-1px;color:#ffffff;">IPMC<span style="color:#e0a83a;">∞</span></div><div style="margin-top:8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b9c9d6;">Professional Services &amp; Consultancy</div></td></tr>
<tr><td style="padding:38px 34px 30px;"><div style="font-size:12px;line-height:18px;font-weight:700;letter-spacing:1.6px;color:#b27b0b;text-transform:uppercase;">${escapeHtml(eyebrow)}</div><h1 style="margin:10px 0 14px;font-size:30px;line-height:38px;color:#102f4b;">${escapeHtml(title)}</h1>${intro ? `<p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#53677a;">${escapeHtml(intro)}</p>` : ''}${body || ''}${ctaLabel && ctaUrl ? `<div style="margin:28px 0;"><a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#e0a83a;color:#102f4b;text-decoration:none;font-weight:700;font-size:14px;padding:13px 22px;border-radius:9px;">${escapeHtml(ctaLabel)}</a></div>` : ''}</td></tr>
<tr><td style="background:#f7f9fb;padding:24px 34px;border-top:1px solid #e7edf2;"><p style="margin:0 0 8px;font-size:12px;line-height:19px;color:#718292;">IPMC Limited · Management, Project Monitoring, QHSE, ESG &amp; Financial Advisory</p><p style="margin:0;font-size:12px;line-height:19px;color:#718292;">You are receiving this email because you subscribed to IPMC Insights.</p>${unsubscribeUrl ? `<p style="margin:12px 0 0;font-size:12px;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#53677a;">Unsubscribe</a></p>` : ''}</td></tr>
</table><p style="margin:14px 0 0;font-size:11px;color:#9aa8b4;">© ${new Date().getFullYear()} IPMC Limited. All rights reserved.</p>
</td></tr></table></body></html>`;

const welcomeEmail = ({ unsubscribeUrl }) => ({
  subject: 'Welcome to IPMC Insights',
  html: baseTemplate({
    preheader: 'Welcome to IPMC Insights — practical updates from IPMC.',
    eyebrow: 'Welcome',
    title: 'You’re now part of IPMC Insights.',
    intro: 'Thank you for subscribing. We’ll share practical updates on project monitoring, ESG, sustainability, QHSE and industry developments.',
    body: `<div style="background:#f7f9fb;border:1px solid #e7edf2;border-radius:12px;padding:18px 20px;margin:8px 0 0;"><p style="margin:0;font-size:14px;line-height:23px;color:#53677a;">We’ll keep your inbox useful, relevant and respectful. You can unsubscribe at any time.</p></div>`,
    ctaLabel: 'Visit IPMC',
    ctaUrl: appUrl,
    unsubscribeUrl,
  }),
  text: `Welcome to IPMC Insights. Thank you for subscribing. Visit ${appUrl}. Unsubscribe: ${unsubscribeUrl || ''}`,
});

const jobApplicationReceivedEmail = ({ name, jobTitle }) => ({
  subject: 'Application Received — IPMC Nigeria',
  html: baseTemplate({
    preheader: 'We have received your IPMC job application.',
    eyebrow: 'Careers',
    title: 'Application received',
    intro: `Thank you, ${name}. We’ve received your application for ${jobTitle || 'the position you selected'} and our team will review it carefully.`,
    body: `<p style="font-size:14px;line-height:24px;color:#53677a;margin:0;">If your application progresses to the next stage, we’ll contact you using the details you provided.</p>`,
    ctaLabel: 'Explore IPMC',
    ctaUrl: `${appUrl}/careers`,
  }),
  text: `Thank you, ${name}. We received your application for ${jobTitle || 'the position'}. We’ll contact you if you progress to the next stage.`,
});

const applicationStatusEmail = ({ name, jobTitle, message }) => ({
  subject: `Application Update — ${jobTitle || 'IPMC Nigeria'}`,
  html: baseTemplate({
    preheader: 'There is an update to your IPMC application.',
    eyebrow: 'Application Update',
    title: 'Your application status has changed',
    intro: `Hi ${name},`,
    body: `<div style="background:#f7f9fb;border-left:4px solid #e0a83a;border-radius:8px;padding:16px 18px;"><p style="margin:0;font-size:15px;line-height:25px;color:#53677a;">${escapeHtml(message)}</p></div>`,
    ctaLabel: 'Visit IPMC Careers',
    ctaUrl: `${appUrl}/careers`,
  }),
  text: `Hi ${name}, ${message}`,
});

const newsletterIssueEmail = ({ subject, summary, content, unsubscribeUrl }) => ({
  subject,
  html: baseTemplate({
    preheader: summary || subject,
    eyebrow: 'IPMC INSIGHTS',
    title: subject,
    intro: summary || 'The latest insights and updates from IPMC.',
    body: `<div style="font-size:15px;line-height:26px;color:#53677a;">${content || ''}</div>`,
    ctaLabel: 'Read More on IPMC',
    ctaUrl: `${appUrl}/newsletter`,
    unsubscribeUrl,
  }),
  text: `${subject}\n\n${summary || ''}\n\n${String(content || '').replace(/<[^>]*>/g, ' ')}\n\nRead more: ${appUrl}/newsletter\nUnsubscribe: ${unsubscribeUrl || ''}`,
});

module.exports = { escapeHtml, welcomeEmail, jobApplicationReceivedEmail, applicationStatusEmail, newsletterIssueEmail };
