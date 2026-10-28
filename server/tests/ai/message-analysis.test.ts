import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import '../setup.js';

async function createAndLoginUser(email = 'msganalysis@test.com') {
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Message Analysis User',
    email,
    password: 'SecurePass1',
  });
  return {
    token: reg.body.accessToken,
    userId: reg.body.user.id,
  };
}

describe('AI User Message Analysis API (/api/ai/chat/analyze-messages & /api/analyze/messages)', () => {
  it('correctly filters user messages and excludes assistant responses from analysis', async () => {
    const mixedMessages = [
      { id: 'msg-1', role: 'user', content: 'I am not comfortable sending private photos before meeting.' },
      { id: 'msg-2', role: 'assistant', content: 'That is a very healthy boundary to establish.' },
      { id: 'msg-3', role: 'user', content: 'Could we instead meet at a public cafe on Saturday?' },
      { id: 'msg-4', role: 'assistant', content: 'Public first dates are recommended for physical safety.' },
    ];

    const res = await request(app)
      .post('/api/ai/chat/analyze-messages')
      .send({
        messages: mixedMessages,
        alreadyAnalyzedIds: [],
        forceReanalyze: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Only the 2 user messages should be analyzed
    expect(res.body.totalUserMessages).toBe(2);
    expect(res.body.newMessagesAnalysis).toHaveLength(2);

    // Verify roles and contents
    expect(res.body.newMessagesAnalysis[0].role).toBe('user');
    expect(res.body.newMessagesAnalysis[0].content).toContain('not comfortable sending private photos');
    expect(res.body.newMessagesAnalysis[1].role).toBe('user');
    expect(res.body.newMessagesAnalysis[1].content).toContain('meet at a public cafe');
  });

  it('separates newly received messages from previously analyzed messages (Two Separate Results: Section A vs Section B)', async () => {
    const historicalMsgId = 'hist-user-1';
    const newMsgId = 'new-user-2';

    const messages = [
      {
        id: historicalMsgId,
        role: 'user',
        content: 'I prefer to drive myself to our first date.',
        timestamp: '2026-10-25T10:00:00.000Z',
      },
      {
        id: newMsgId,
        role: 'user',
        content: 'Why are you asking me for money when we have never met in person?',
        timestamp: '2026-10-28T10:00:00.000Z',
      },
    ];

    // Simulate that historicalMsgId was already analyzed previously
    const res = await request(app)
      .post('/api/ai/chat/analyze-messages')
      .send({
        messages,
        alreadyAnalyzedIds: [historicalMsgId],
        forceReanalyze: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Section A: New Messages Analysis must contain ONLY the unanalyzed new message
    expect(res.body.newMessagesAnalysis).toHaveLength(1);
    expect(res.body.newMessagesAnalysis[0].messageId).toBe(newMsgId);
    expect(res.body.newMessagesAnalysis[0].category).toBe('Safety Verification');
    expect(res.body.newMessagesAnalysis[0].topic).toContain('Financial');
    expect(res.body.newMessagesAnalysis[0].intent).toBeDefined();
    expect(res.body.newMessagesAnalysis[0].meaningAndContext).toBeDefined();
    expect(res.body.newMessagesAnalysis[0].actionableInsights.length).toBeGreaterThan(0);

    // Section B: Existing Messages Analysis must contain the previously analyzed message
    expect(res.body.existingMessagesAnalysis).toHaveLength(1);
    expect(res.body.existingMessagesAnalysis[0].messageId).toBe(historicalMsgId);
  });

  it('provides an option to force reanalyze all messages when requested', async () => {
    const messages = [
      { id: 'm-1', role: 'user', content: 'I have a strict rule never to wire money.' },
      { id: 'm-2', role: 'user', content: 'Let us stay on the app until we know each other better.' },
    ];

    const res = await request(app)
      .post('/api/ai/chat/analyze-messages')
      .send({
        messages,
        alreadyAnalyzedIds: ['m-1', 'm-2'], // Both previously marked as analyzed
        forceReanalyze: true, // Force re-evaluation
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // When forceReanalyze is true, all messages should be returned in Section A
    expect(res.body.newMessagesAnalysis).toHaveLength(2);
    expect(res.body.existingMessagesAnalysis).toHaveLength(0);
  });

  it('extracts deep insights: intent, category, key points, questions, and overall synthesis', async () => {
    const messages = [
      {
        id: 'user-complex-1',
        role: 'user',
        content: 'I noticed your profile pictures look like stock models. Can we do a quick video call tonight?',
      },
    ];

    const res = await request(app)
      .post('/api/analyze/messages') // Test alias route
      .send({
        messages,
        alreadyAnalyzedIds: [],
        forceReanalyze: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const analyzed = res.body.newMessagesAnalysis[0];
    expect(analyzed.category).toBe('Red Flag Inquiry');
    expect(analyzed.questionsAndRequests.length).toBeGreaterThan(0);
    expect(analyzed.questionsAndRequests[0]).toContain('video call');
    expect(analyzed.actionableInsights.length).toBeGreaterThan(0);
    expect(analyzed.meaningAndContext).toBeDefined();

    // Overall conversation analysis
    expect(res.body.overallAnalysis).toBeDefined();
    expect(res.body.overallAnalysis.overallSummary).toBeDefined();
    expect(res.body.overallAnalysis.userBoundaryPosture).toBeDefined();
  });

  it('persists analyzed status and handles database sync for authenticated users', async () => {
    const { token, userId } = await createAndLoginUser('persistmsg@test.com');

    const msgId = `auth-user-msg-${Date.now()}`;
    const res = await request(app)
      .post('/api/ai/chat/analyze-messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        messages: [
          {
            id: msgId,
            role: 'user',
            content: 'I do not give out my phone number or social media to people I just started talking to.',
          },
        ],
        alreadyAnalyzedIds: [],
        forceReanalyze: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.newMessagesAnalysis).toHaveLength(1);

    // Fetch user messages from DB endpoint to verify persistence
    const fetchRes = await request(app)
      .get('/api/ai/chat/messages')
      .set('Authorization', `Bearer ${token}`);

    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body.messages.length).toBeGreaterThan(0);
    const persisted = fetchRes.body.messages.find((m: any) => m.id === msgId);
    expect(persisted).toBeDefined();
    expect(persisted.analyzed).toBe(true);
    expect(persisted.analysis).toBeDefined();
    expect(persisted.analysis.category).toBe('Boundary Setting');
  });
});
