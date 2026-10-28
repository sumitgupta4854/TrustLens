import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import '../setup.js';

async function createAndLoginUser(email = 'chatuser@test.com') {
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Chat Test User',
    email,
    password: 'SecurePass1',
  });
  return {
    token: reg.body.accessToken,
    userId: reg.body.user.id,
  };
}

describe('AI Safety Chat API (/api/ai/chat)', () => {
  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Can you help me set a boundary?' });

    expect(res.status).toBe(401);
  });

  it('rejects empty messages with 400 validation error', async () => {
    const { token } = await createAndLoginUser('chatempty@test.com');

    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: '' });

    expect(res.status).toBe(400);
  });

  it('generates a compassionate dating safety response with rule-based fallback when no LLM key is set', async () => {
    const { token } = await createAndLoginUser('chatfinancial@test.com');

    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Someone is asking me for $200 for an emergency ticket. What should I do?',
        history: [],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.response).toBeTruthy();
    expect(res.body.response).toContain('Financial Safety');
    expect(res.body.engine).toBe('pattern_rules_fallback');
    expect(res.body.privacyNotice).toBeTruthy();
  });
});
