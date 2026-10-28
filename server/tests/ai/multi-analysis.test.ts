import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { SafetyAnalysis } from '../../src/models/SafetyAnalysis.js';
import '../setup.js';

async function createAndLoginUser(email = 'multitest@test.com') {
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Multi Test User',
    email,
    password: 'SecurePass1',
  });
  return {
    token: reg.body.accessToken,
    userId: reg.body.user.id,
  };
}

describe('Cross-Conversation AI Intelligence API (/api/analyze/overview)', () => {
  it('synthesizes multiple conversations passed in the payload', async () => {
    const res = await request(app)
      .post('/api/analyze/overview')
      .send({
        conversations: [
          {
            id: 'c-1',
            title: 'Match Alex - Tinder',
            text: 'I have a travel emergency, could you wire me $150? If you cared you would help.',
            concernLevel: 'high',
          },
          {
            id: 'c-2',
            title: 'Match Taylor - Hinge',
            text: 'Take your time! No pressure at all. Let us meet at a busy coffee shop whenever you are comfortable.',
            concernLevel: 'low',
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const report = res.body.report;
    expect(report.totalConversations).toBe(2);
    expect(report.sentimentDistribution.concerning).toBe(1);
    expect(report.sentimentDistribution.positive).toBe(1);
    expect(report.individualSummaries).toHaveLength(2);
    expect(report.strategicRecommendations.length).toBeGreaterThan(0);
    expect(report.intentAnalysis.userIntent.length).toBeGreaterThan(0);
  });

  it('aggregates authenticated user saved analyses and enforces user authorization', async () => {
    const userA = await createAndLoginUser('usera.overview@test.com');
    const userB = await createAndLoginUser('userb.overview@test.com');

    // Saved analyses for User A
    await SafetyAnalysis.create({
      userId: userA.userId,
      summary: 'Analysis with high concern regarding money transfers',
      concernLevel: 'high',
      findings: [
        {
          category: 'financial_pressure',
          title: 'Wire request',
          evidence: 'send me $100',
          explanation: 'solicitation',
          confidence: 'high',
          recommendedAction: 'Refuse funds',
        },
      ],
      replySuggestions: { gentle: '', firm: '', direct: '' },
      safetySteps: ['Do not send money'],
      limitations: [],
      isOptInSaved: true,
    });

    // Saved analyses for User B (must NOT leak into User A's report)
    await SafetyAnalysis.create({
      userId: userB.userId,
      summary: 'Secret private conversation for User B',
      concernLevel: 'high',
      findings: [],
      replySuggestions: { gentle: '', firm: '', direct: '' },
      safetySteps: [],
      limitations: [],
      isOptInSaved: true,
    });

    const res = await request(app)
      .post('/api/analyze/overview')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const report = res.body.report;
    // Should ONLY contain User A's record (1 conversation)
    expect(report.totalConversations).toBe(1);
    expect(report.overallSummary).not.toContain('User B');
  });

  it('respects concernFilter parameters', async () => {
    const res = await request(app)
      .post('/api/analyze/overview')
      .send({
        concernFilter: 'high',
        conversations: [
          {
            id: 'c-high',
            title: 'Urgent Wire',
            text: 'Send me money immediately',
            concernLevel: 'high',
          },
          {
            id: 'c-low',
            title: 'Casual Chat',
            text: 'Sounds great, see you at the park',
            concernLevel: 'low',
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.report.totalConversations).toBe(1);
    expect(res.body.report.individualSummaries[0].concernLevel).toBe('high');
  });
});
