const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

const ADMIN = { name: 'Admin', email: 'admin@test.com', password: 'TestPass123!', role: 'admin' };
const EDITOR = { name: 'Editor', email: 'editor@test.com', password: 'TestPass123!', role: 'editor' };
const VIEWER = { name: 'Viewer', email: 'viewer@test.com', password: 'TestPass123!', role: 'viewer' };

const validPost = {
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'A short excerpt that is long enough to pass validation.',
  content: 'Full body content for the test post, long enough to be realistic.',
  category: 'insights',
};

async function loginAs(user) {
  await User.create(user);
  const agent = request.agent(app);
  const loginRes = await agent.post('/api/auth/login').send({ email: user.email, password: user.password });
  const csrfCookie = loginRes.headers['set-cookie'].find((c) => c.startsWith('csrfToken='));
  const csrfToken = csrfCookie.split(';')[0].split('=')[1];
  return { agent, csrfToken };
}

describe('Admin blog CRUD', () => {
  it('rejects post creation with no session at all', async () => {
    const res = await request(app).post('/api/blog').send(validPost);
    expect(res.status).toBe(401);
  });

  it('rejects post creation from a viewer (read-only role)', async () => {
    const { agent, csrfToken } = await loginAs(VIEWER);
    const res = await agent.post('/api/blog').set('X-CSRF-Token', csrfToken).send(validPost);
    expect(res.status).toBe(403);
  });

  it('allows an editor to create a post', async () => {
    const { agent, csrfToken } = await loginAs(EDITOR);
    const res = await agent.post('/api/blog').set('X-CSRF-Token', csrfToken).send(validPost);
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe(validPost.slug);
  });

  it('allows an editor to update their post', async () => {
    const { agent, csrfToken } = await loginAs(EDITOR);
    const createRes = await agent.post('/api/blog').set('X-CSRF-Token', csrfToken).send(validPost);
    const id = createRes.body.data._id;

    const updateRes = await agent.put(`/api/blog/${id}`).set('X-CSRF-Token', csrfToken).send({ ...validPost, title: 'Updated Title' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe('Updated Title');
  });

  it('rejects post deletion from an editor — delete is admin-only', async () => {
    const { agent, csrfToken } = await loginAs(EDITOR);
    const createRes = await agent.post('/api/blog').set('X-CSRF-Token', csrfToken).send(validPost);
    const id = createRes.body.data._id;

    const deleteRes = await agent.delete(`/api/blog/${id}`).set('X-CSRF-Token', csrfToken);
    expect(deleteRes.status).toBe(403);
  });

  it('allows an admin to delete a post, and it is actually gone afterward', async () => {
    const { agent, csrfToken } = await loginAs(ADMIN);
    const createRes = await agent.post('/api/blog').set('X-CSRF-Token', csrfToken).send(validPost);
    const id = createRes.body.data._id;

    const deleteRes = await agent.delete(`/api/blog/${id}`).set('X-CSRF-Token', csrfToken);
    expect(deleteRes.status).toBe(200);

    const getRes = await request(app).get(`/api/blog/${validPost.slug}`);
    expect(getRes.status).toBe(404);
  });

  it('rejects a post with a title but no content (validation)', async () => {
    const { agent, csrfToken } = await loginAs(ADMIN);
    const { content, ...incomplete } = validPost;
    const res = await agent.post('/api/blog').set('X-CSRF-Token', csrfToken).send(incomplete);
    expect(res.status).toBe(400);
  });
});
