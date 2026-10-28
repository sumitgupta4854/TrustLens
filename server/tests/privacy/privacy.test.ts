import { describe, it, expect } from 'vitest';
import request from 'supertest';
import '../setup.js';
import { app } from '../../src/app.js';

describe('Privacy Invariants', () => {
  it('does not save conversation text by default (no saveHistoryConsent)', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Privacy User',
      email: 'privacy@test.com',
      password: 'SecurePass1',
    });
    const token = reg.body.accessToken;

    const analyzeRes = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({
        conversationText: 'Send me money via CashApp please.',
        saveHistoryConsent: false,
      });
    expect(analyzeRes.status).toBe(200);
    expect(analyzeRes.body.savedAnalysisId).toBeNull();

    // History should be empty
    const histRes = await request(app)
      .get('/api/analyses')
      .set('Authorization', `Bearer ${token}`);
    expect(histRes.status).toBe(200);
    expect(histRes.body.analyses).toHaveLength(0);
  });

  it('saves analysis only when user opts in', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Optin User',
      email: 'optin@test.com',
      password: 'SecurePass1',
    });
    const token = reg.body.accessToken;

    const analyzeRes = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({
        conversationText: 'Send me money via CashApp please.',
        saveHistoryConsent: true,
      });
    expect(analyzeRes.status).toBe(200);
    expect(analyzeRes.body.savedAnalysisId).not.toBeNull();

    const histRes = await request(app)
      .get('/api/analyses')
      .set('Authorization', `Bearer ${token}`);
    expect(histRes.body.analyses).toHaveLength(1);
    // Saved analysis must NOT contain raw conversation text as a field
    const savedAnalysis = histRes.body.analyses[0];
    expect(savedAnalysis).not.toHaveProperty('conversationText');
    expect(savedAnalysis).not.toHaveProperty('rawText');
  });

  it('prevents user from deleting another user analysis', async () => {
    const ts = Date.now();
    const regA = await request(app).post('/api/auth/register').send({
      name: 'Owner', email: `owner.${ts}@test.com`, password: 'SecurePass1' });
    const regB = await request(app).post('/api/auth/register').send({
      name: 'OtherUser', email: `other.${ts}@test.com`, password: 'SecurePass1' });

    const aToken = regA.body.accessToken;
    const bToken = regB.body.accessToken;

    expect(aToken).toBeDefined();
    expect(bToken).toBeDefined();

    const analysisRes = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${aToken}`)
      .send({ conversationText: 'Send me gift cards.', saveHistoryConsent: true });

    expect(analysisRes.status).toBe(200);
    const analysisId = analysisRes.body.savedAnalysisId;
    expect(analysisId).not.toBeNull();

    const deleteRes = await request(app)
      .delete(`/api/analyses/${analysisId}`)
      .set('Authorization', `Bearer ${bToken}`);
    expect(deleteRes.status).toBe(403);
  });

  it('allows user to delete their own analysis', async () => {
    const ts = Date.now();
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Del User', email: `del.${ts}@test.com`, password: 'SecurePass1' });
    const token = reg.body.accessToken;

    const analysisRes = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ conversationText: 'Send me gift cards.', saveHistoryConsent: true });

    const analysisId = analysisRes.body.savedAnalysisId;
    const deleteRes = await request(app)
      .delete(`/api/analyses/${analysisId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);
  });
});
