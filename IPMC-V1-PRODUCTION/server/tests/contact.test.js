const request = require('supertest');
const app = require('../server');
const ContactMessage = require('../models/ContactMessage');

describe('POST /api/contact', () => {
  const validPayload = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Project inquiry',
    message: 'This is a test message that is definitely long enough.',
  };

  it('saves the message and responds quickly even with no Resend key configured', async () => {
    // Regression test for the real production bug: email sending used to
    // block the response with no timeout, so an unconfigured email
    // provider made this request hang forever with no error and no log
    // line. It must now respond well within the test timeout regardless
    // of email delivery. (Also covers the SMTP\u2192Resend provider swap.)
    delete process.env.RESEND_API_KEY;

    const res = await request(app).post('/api/contact').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const saved = await ContactMessage.findOne({ email: validPayload.email });
    expect(saved).not.toBeNull();
    expect(saved.subject).toBe(validPayload.subject);
  });

  it('rejects a submission with a missing required field', async () => {
    const { message, ...incomplete } = validPayload;
    const res = await request(app).post('/api/contact').send(incomplete);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a message that is too short to be useful', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, message: 'short' });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid email address', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, email: 'not-an-email' });
    expect(res.status).toBe(400);
  });
});
