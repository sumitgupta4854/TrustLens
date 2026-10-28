import { describe, it, expect } from 'vitest';
import request from 'supertest';
import '../setup.js';
import { app } from '../../src/app.js';

describe('Authentication API', () => {
  const testUser = {
    name: 'Alex Test',
    email: 'alex@trustlens.test',
    password: 'SecurePass1',
  };

  describe('POST /api/auth/register', () => {
    it('registers a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('rejects duplicate email registration', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'other@test.com', password: 'weak' });
      expect(res.status).toBe(400);
    });

    it('rejects invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'not-an-email' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('logs in with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
    });

    it('rejects incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword1',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects non-existent user with generic message', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@nowhere.com',
        password: 'SomePassword1',
      });
      expect(res.status).toBe(401);
      // Should NOT disclose if email exists
      expect(res.body.error).toBe('Invalid email or password.');
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns current user when authenticated', async () => {
      const reg = await request(app).post('/api/auth/register').send(testUser);
      const token = reg.body.accessToken;
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('rejects unauthenticated requests', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('rejects requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('issues new access token via refresh cookie', async () => {
      const reg = await request(app).post('/api/auth/register').send(testUser);
      const cookies = reg.headers['set-cookie'];
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
    });

    it('rejects request without refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('logs out and clears session', async () => {
      const reg = await request(app).post('/api/auth/register').send(testUser);
      const cookies = reg.headers['set-cookie'];
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);
      expect(logoutRes.status).toBe(200);
      // After logout, same cookie should be invalid
      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);
      expect(refreshRes.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout-all', () => {
    it('invalidates all user sessions', async () => {
      const reg = await request(app).post('/api/auth/register').send(testUser);
      const token = reg.body.accessToken;
      const cookies = reg.headers['set-cookie'];
      const res = await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      // Verify refresh token is now revoked
      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);
      expect(refreshRes.status).toBe(401);
    });
  });

  describe('Password Reset Flow', () => {
    it('accepts forgot-password for any email (no enumeration)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'anyemail@test.com' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
