const { getUnsubscribeUrl } = require('./newsletterToken');

const esc = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const baseUrl = () => (process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');
const appName = process.env.APP_NAME || 'IPMC Nigeria';
const fromAddress = process.env.RESEND_FROM_EMAIL || '';

const shell = ({ preheader = '', eyebrow = 'IPMC INSIGHTS', title, intro = '', content = '', unsubscribeEmail }) => {
  const unsubscribeUrl = unsubscribeEmail ? getUnsubscribeUrl(unsubscribeEmail) : null;
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e7ebf2;">
<tr><td style="background:#082f49;padding:28px 34px;">
  <div style="font-size:25px;font-weight:800;color:#ffffff;letter-spacing:-.5px;">IPMC<span style="color:#f59e0b;">∞</span></div>
  <div style="margin-top:8px;color:#bfdbfe;font-size:12px;letter-spacing:1.6px;font-weight:700;">${esc(eyebrow)}</div>
</td></tr>
<tr><td style="padding:38px 34px 30px;">
  <h1 style="margin:0 0 14px;font-size:30px;line-height:1.2;color:#0f2740;">${esc(title)}</h1>
  ${intro ? `<p style="margin:0 0 26px;font-size:16px;line-height:1.7;color:#526174;">${esc(intro)}</p>` : ''}
  ${content}
</td></tr>
<tr><td style="background:#f8fafc;border-top:1px solid #e7ebf2;padding:24px 34px;">
  <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#64748b;">${esc(appName)} · Professional management &amp; consultancy services</p>
  <p style="margin:0;font-size:12px;line-height:1.7;color:#94a3b8;">
    <a href="${esc(baseUrl())}" style="color:#0f766e;text-decoration:none;">Visit our website</a>
    ${unsubscribeUrl ? `&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${esc(unsubscribeUrl)}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>` : ''}
  </p>
</td></tr>
</table>
<p style="max-width:680px;margin:14px auto 0;text-align:center;font-size:11px;color:#94a3b8;">You are receiving this email because you subscribed to IPMC Insights.</p>
</td></tr></table>
</body></html>`;
};

exports.welcome = (email) => ({
  subject: 'Welcome to IPMC Insights',
  headers: {
    'List-Unsubscribe': `<${getUnsubscribeUrl(email)}>`
  },
  html: shell({
    preheader: 'You are now subscribed to IPMC Insights.',
    title: 'Welcome to IPMC Insights',
    intro: 'Thank you for subscribing. We will send you useful insights, project monitoring updates, ESG developments and industry news.',
    content: `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-top:10px;">
      <p style="margin:0;color:#166534;font-size:14px;line-height:1.7;"><strong>You are all set.</strong> We will keep the emails relevant and useful. You can unsubscribe at any time using the link at the bottom of our emails.</p>
    </div>`,
    unsubscribeEmail: email,
  }),
  text: `Welcome to IPMC Insights. Thank you for subscribing. Manage your subscription at ${getUnsubscribeUrl(email)}`,
});

exports.issue = ({ subject, summary, content, email }) => ({
  subject,
  headers: {
    'List-Unsubscribe': `<${getUnsubscribeUrl(email)}>`,
  },
  html: shell({
    preheader: summary || subject,
    eyebrow: 'IPMC INSIGHTS',
    title: subject,
    intro: summary || '',
    content: `<div style="font-size:15px;line-height:1.8;color:#334155;">${content}</div>`,
    unsubscribeEmail: email,
  }),
  text: `${subject}\n\n${summary || ''}\n\n${String(content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n\nUnsubscribe: ${getUnsubscribeUrl(email)}`,
});

exports.applicationReceived = ({ name, jobTitle }) => ({
  subject: `Application received — ${jobTitle || appName}`,
  html: shell({
    preheader: 'Your application has been received.',
    eyebrow: 'CAREERS',
    title: 'Application received',
    intro: `Thank you, ${name}. We have received your application for ${jobTitle || 'the position'}.`,
    content: `<p style="margin:0;font-size:14px;line-height:1.8;color:#526174;">Our team will review your application and contact you if you progress to the next stage.</p>`,
  }),
  text: `Thank you, ${name}. We received your application for ${jobTitle || 'the position'}. Our team will review it and contact you if you progress.`,
});
