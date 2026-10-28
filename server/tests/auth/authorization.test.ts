import { describe, it, expect } from 'vitest';
import request from 'supertest';
import '../setup.js';
import { app } from '../../src/app.js';

async function createAndLoginUser(email = 'user@test.com') {
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email,
    password: 'SecurePass1',
  });
  return {
    token: reg.body.accessToken,
    userId: reg.body.user.id,
    cookies: reg.headers['set-cookie'],
  };
}

describe('Boundary API Authorization', () => {
  it('blocks unauthenticated boundary creation', async () => {
    const res = await request(app).post('/api/boundaries').send({
      title: 'No money requests',
      description: 'I do not send money to people I have not met.',
      category: 'financial',
    });
    expect(res.status).toBe(401);
  });

  it('allows authenticated user to create a boundary', async () => {
    const { token } = await createAndLoginUser();
    const res = await request(app)
      .post('/api/boundaries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'No money requests',
        description: 'I do not send money to people I have not met in person.',
        category: 'financial',
      });
    expect(res.status).toBe(201);
    expect(res.body.boundary.title).toBe('No money requests');
  });

  it('prevents cross-user boundary access', async () => {
    const userA = await createAndLoginUser('userA@test.com');
    const userB = await createAndLoginUser('userB@test.com');

    // User A creates a boundary
    const createRes = await request(app)
      .post('/api/boundaries')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({
        title: 'Private boundary',
        description: 'User A personal boundary',
        category: 'personal_privacy',
      });
    const boundaryId = createRes.body.boundary.id;

    // User B tries to access User A's boundary
    const getRes = await request(app)
      .get(`/api/boundaries/${boundaryId}`)
      .set('Authorization', `Bearer ${userB.token}`);
    expect(getRes.status).toBe(403);
  });

  it('prevents cross-user boundary deletion', async () => {
    const userA = await createAndLoginUser('userC@test.com');
    const userB = await createAndLoginUser('userD@test.com');

    const createRes = await request(app)
      .post('/api/boundaries')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({
        title: 'My boundary',
        description: 'Do not share my address',
        category: 'personal_privacy',
      });
    const boundaryId = createRes.body.boundary.id;

    const deleteRes = await request(app)
      .delete(`/api/boundaries/${boundaryId}`)
      .set('Authorization', `Bearer ${userB.token}`);
    expect(deleteRes.status).toBe(403);
  });

  it('lists only current user boundaries', async () => {
    const userA = await createAndLoginUser('userE@test.com');
    const userB = await createAndLoginUser('userF@test.com');

    await request(app)
      .post('/api/boundaries')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ title: 'UserA boundary', description: 'Boundary for user A', category: 'financial' });

    const listRes = await request(app)
      .get('/api/boundaries')
      .set('Authorization', `Bearer ${userB.token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.boundaries).toHaveLength(0); // UserB has no boundaries
  });
});
