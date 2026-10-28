import { StructuredAnalysisOutput } from '../validators/analyze.schema.js';

export interface UserBoundaryItem {
  id?: string;
  title: string;
  description: string;
  category: string;
}

export interface AnalysisOptions {
  situationDescription?: string;
  analysisType?: string;
  anonymize?: boolean;
}

interface PatternRule {
  category: string;
  title: string;
  concernScore: number; // 1 = low, 2 = moderate, 3 = high
  regexList: RegExp[];
  confidence: 'low' | 'medium' | 'high';
  explanationTemplate: (match: string) => string;
  recommendedAction: string;
  replyOverrides?: {
    gentle: string;
    firm: string;
    direct: string;
  };
  safetyAdvice: string[];
}

const PATTERN_RULES: PatternRule[] = [
  // 1. Financial Inquiries & Solicitations
  {
    category: 'financial_pressure',
    title: 'Financial or Money Request',
    concernScore: 3,
    regexList: [
      /(?:send|wire|transfer|lend|borrow|cashapp|venmo|paypal|zelle|crypto|bitcoin|gift\s*card|apple\s*card|steam\s*card)\s+(?:me\s+)?(?:\$|\d+|some\s+money|cash|help)/i,
      /(?:need|short\s+on)\s+(?:some\s+)?(?:money|cash|rent|gas|crypto|funds|hospital\s+bill|groceries|tickets?)/i,
      /(?:can\s+you|could\s+you)\s+(?:send|help\s+me\s+with|spot\s+me|wire|transfer)\s+(?:\$|\d+|money|funds|dollars|cash)/i,
      /(?:financial\s+emergency|stuck\s+at\s+the\s+airport|account\s+is\s+frozen|flight\s+tickets?|customs\s+fee)/i,
      /\b(?:cashapp|venmo|zelle|wire\s+transfer|wire\s+me)\b/i,
      /(?:invest\s+(?:in|with)|crypto\s+trading|guaranteed\s+return|forex\s+trading)/i,
    ],
    confidence: 'high',
    explanationTemplate: (match) =>
      `The conversation contains an explicit or implied request for financial assets ("${match}"). Early financial solicitations in dating interactions represent one of the highest statistical risk patterns for romance scams.`,
    recommendedAction:
      'Do not send money, gift cards, or cryptocurrency to someone you have not met and verified in person. Maintain a strict, non-negotiable personal boundary.',
    replyOverrides: {
      gentle: "I really enjoy talking with you, but I have a personal principle never to send money or transfer funds to online connections. I hope you understand.",
      firm: "I do not send money, gift cards, or financial assistance under any circumstance. Please do not ask me again.",
      direct: "No. I do not send money or financial support to anyone online.",
    },
    safetyAdvice: [
      'Never transfer funds, cryptocurrency, or gift cards to someone you have only communicated with online.',
      'Urgent emotional crises or stranded scenarios are classic pretexts used to elicit funds.',
    ],
  },

  // 2. Intimate Photos & Media Boundaries
  {
    category: 'photo_pressure',
    title: 'Intimate Media or Photo Pressure',
    concernScore: 3,
    regexList: [
      /(?:send|let\s+me\s+see|show\s+me|give\s+me)\s+(?:a\s+)?(?:nude|pic|photo|spicy|sexy|body|naked|snap)/i,
      /(?:why\s+won['’]?t\s+you|don['’]?t\s+be\s+shy|just\s+one\s+picture|prove\s+it\s+to\s+me)\s*(?:send|pic|photo)?/i,
      /(?:if\s+you\s+trusted\s+me\s+you['’]?d\s+send|everyone\s+does\s+it|don['’]?t\s+be\s+boring)/i,
      /(?:what\s+are\s+you\s+wearing|send\s+something\s+revealing)/i,
    ],
    confidence: 'high',
    explanationTemplate: (match) =>
      `Repeated or pressured soliciting of private photographs ("${match}") demonstrates disregard for personal comfort and physical privacy boundaries.`,
    recommendedAction:
      'Reiterate your personal boundary firmly. Do not feel compelled to share intimate media to validate another person\'s interest.',
    replyOverrides: {
      gentle: "I'm not comfortable sending pictures like that. I prefer to keep our conversation respectful and focus on getting to know each other.",
      firm: "I've already told you I don't send private photos. I expect you to respect my comfort level and drop the subject.",
      direct: "I do not send private or intimate photos. Stop asking.",
    },
    safetyAdvice: [
      'Digital photos can be archived, leaked, or leveraged for extortion. A respectful partner accepts "no" on the first refusal.',
      'If someone threatens to publish or distribute media unless you comply, cease all contact immediately and preserve evidence.',
    ],
  },

  // 3. Emotional Guilt & Manipulation
  {
    category: 'emotional_guilt_trip',
    title: 'Emotional Guilt-Tripping or Manipulation',
    concernScore: 2,
    regexList: [
      /(?:if\s+you\s+really\s+(?:loved|liked|cared\s+about|trusted)\s+me)/i,
      /(?:you\s+don['’]?t\s+trust\s+me|why\s+are\s+you\s+so\s+cold|after\s+all\s+I\s+did)/i,
      /(?:you['’]?re\s+breaking\s+my\s+heart|guess\s+I\s+mean\s+nothing\s+to\s+you|guess\s+I\s+was\s+wrong\s+about\s+you)/i,
      /(?:you['’]?re\s+being\s+difficult|why\s+do\s+you\s+make\s+everything\s+so\s+hard)/i,
    ],
    confidence: 'medium',
    explanationTemplate: (match) =>
      `The conversation displays emotional leverage or guilt-induction ("${match}") designed to induce shame or obligation when your comfort limits are asserted.`,
    recommendedAction:
      'Notice when personal boundaries are met with guilt rather than understanding. Healthy connections honor stated limits without retaliatory guilt.',
    replyOverrides: {
      gentle: 'My boundaries are about my personal safety and comfort, not how I feel about you. Please let us respect that.',
      firm: "Guilt-tripping me for holding healthy boundaries isn't acceptable communication. I expect my limits to be honored.",
      direct: "I will not be guilted into doing something I am uncomfortable with.",
    },
    safetyAdvice: [
      'Emotional guilt trips often escalate if you give in. Holding firm serves as a decisive test of genuine respect.',
    ],
  },

  // 4. Gaslighting & Boundary Invalidation
  {
    category: 'gaslighting_invalidation',
    title: 'Boundary Invalidation & Gaslighting',
    concernScore: 2,
    regexList: [
      /(?:you['’]?re\s+being\s+paranoid|you['’]?re\s+overreacting|can['’]?t\s+take\s+a\s+joke)/i,
      /(?:you['’]?re\s+crazy|you['’]?re\s+insane|nobody\s+else\s+has\s+a\s+problem)/i,
      /(?:it\s+was\s+just\s+a\s+compliment|why\s+are\s+you\s+making\s+a\s+big\s+deal)/i,
    ],
    confidence: 'medium',
    explanationTemplate: (match) =>
      `The message attempts to dismiss or invalidate your valid reaction ("${match}"), reframing reasonable caution as overreaction or paranoia.`,
    recommendedAction:
      'Trust your instincts. Dismissing your feelings or calling you paranoid when you express discomfort is a common red flag.',
    replyOverrides: {
      gentle: 'My comfort level is valid, and I expect my perspective to be respected even if we see things differently.',
      firm: 'Labeling my caution as paranoia is dismissive. I require my comfort and safety limits to be honored.',
      direct: 'My boundaries are not up for debate. Respect them or we will not continue.',
    },
    safetyAdvice: [
      'Healthy partners validate your right to feel safe rather than arguing against your boundaries.',
    ],
  },

  // 5. Rushed Pacing & Love-Bombing
  {
    category: 'rushed_commitment',
    title: 'Premature Pacing or Love-Bombing',
    concernScore: 2,
    regexList: [
      /(?:we['’]?re\s+soulmates|meant\s+to\s+be|never\s+felt\s+this\s+way|falling\s+in\s+love\s+already)/i,
      /(?:delete\s+(?:the\s+app|your\s+profile|tinder|hinge|bumble)|be\s+exclusive\s+right\s+now)/i,
      /(?:destiny|marry\s+me|spend\s+the\s+rest\s+of\s+our\s+lives)/i,
      /(?:why\s+(?:did\s+it\s+take|haven['’]?t\s+you|aren['’]?t\s+you)\s+(?:so\s+long\s+to\s+reply|texting\s+back))/i,
    ],
    confidence: 'medium',
    explanationTemplate: (match) =>
      `The interaction demonstrates intense, premature emotional acceleration ("${match}"). Rapid pacing is frequently used to bypass normal rational risk evaluation.`,
    recommendedAction:
      'Maintain an unhurried, measured pace. Genuine connections develop through consistent actions over time rather than instant dramatic declarations.',
    replyOverrides: {
      gentle: "I appreciate your enthusiasm, but I prefer to take things slowly and get to know someone over time.",
      firm: "We've only just connected, and I need us to maintain a realistic, comfortable pace.",
      direct: "This is moving too fast for me. Let's slow down.",
    },
    safetyAdvice: [
      'Take regular step-backs to evaluate whether the level of intimacy corresponds to the actual time and shared experiences together.',
    ],
  },

  // 6. Private & Isolated Meetup Pressure
  {
    category: 'isolation_location',
    title: 'Private Venue or Isolated Location Pressure',
    concernScore: 2,
    regexList: [
      /(?:come\s+to\s+my\s+(?:place|apartment|house|hotel|room)|at\s+my\s+apartment)/i,
      /(?:come\s+over\s+to\s+my|meet\s+at\s+my\s+hotel|private\s+place\s+to\s+talk)/i,
      /(?:I['’]?ll\s+pick\s+you\s+up\s+at\s+your\s+house|let\s+me\s+drive\s+you)/i,
      /(?:why\s+do\s+we\s+have\s+to\s+meet\s+in\s+public|coffee\s+shops\s+are\s+boring)/i,
    ],
    confidence: 'high',
    explanationTemplate: (match) =>
      `Insisting on meeting at a private residence or isolated venue for initial encounters ("${match}") circumvents essential physical safety precautions.`,
    recommendedAction:
      'Strictly enforce public meeting venues and independent transportation for initial dates.',
    replyOverrides: {
      gentle: "For my safety, I always meet in busy public venues for our first few dates and arrange my own transit.",
      firm: "I do not meet in private residences or accept home pickups with someone I haven't met in person yet.",
      direct: "I only meet in public coffee shops or restaurants. I will not meet at private residences.",
    },
    safetyAdvice: [
      'Never agree to a first date in a secluded location, hotel room, or private residence.',
      'Always arrange your own transportation so you have complete freedom to leave whenever you wish.',
    ],
  },

  // 7. Pressure to Migrate Off-Platform
  {
    category: 'channel_migration',
    title: 'Pressure to Move Off-Platform Rapidly',
    concernScore: 2,
    regexList: [
      /(?:let['’]?s\s+move\s+to\s+(?:whatsapp|telegram|signal|snapchat)|message\s+me\s+on\s+telegram)/i,
      /(?:I\s+hate\s+this\s+app|I['’]?m\s+deleting\s+this\s+app\s+soon|give\s+me\s+your\s+number\s+now)/i,
      /(?:text\s+my\s+(?:personal\s+)?number|what['’]?s\s+your\s+whatsapp)/i,
    ],
    confidence: 'medium',
    explanationTemplate: (match) =>
      `Rushing to shift the conversation to external or encrypted messaging channels ("${match}") is a recognized tactic to avoid dating platform detection and moderation filters.`,
    recommendedAction:
      'Remain on the verified dating platform until basic trust, verification, and comfort are established.',
    replyOverrides: {
      gentle: "I prefer to keep our conversations on this app for a few days until we get to know each other better.",
      firm: "I keep all messaging on this platform until we've met in person. I appreciate you respecting that.",
      direct: "I'm staying on this app for now.",
    },
    safetyAdvice: [
      'Dating platforms offer report and verification tools that encrypted channels like Telegram lack.',
    ],
  },

  // 8. Explicit Threats or Intimidation
  {
    category: 'threats_intimidation',
    title: 'Hostility, Entitlement, or Threatening Language',
    concernScore: 3,
    regexList: [
      /(?:you['’]?ll\s+regret|I['’]?ll\s+make\s+sure\s+everyone\s+knows|I['’]?ll\s+leak)/i,
      /(?:you\s+owe\s+me|wasted\s+my\s+time|bitch|slut|stupid|asshole)/i,
      /(?:I\s+know\s+where\s+you\s+live|don['’]?t\s+fuck\s+with\s+me)/i,
    ],
    confidence: 'high',
    explanationTemplate: (match) =>
      `The conversation contains hostile, coercive, or threatening expressions ("${match}"). Immediate disengagement is warranted.`,
    recommendedAction:
      'Do not engage in argument or counter-escalation. Preserve screenshots, report the account to the platform, and block immediately.',
    replyOverrides: {
      gentle: "This communication is inappropriate. I am discontinuing this conversation.",
      firm: "Hostile or threatening language is unacceptable. Do not contact me again.",
      direct: "Do not contact me again. I am blocking and reporting this profile.",
    },
    safetyAdvice: [
      'Preserve screenshots of threatening messages before blocking.',
      'Report the user profile to the dating platform trust & safety department.',
      'If you believe you are in immediate danger, contact your local emergency services.',
    ],
  },
];

const RESPECTFUL_MARKERS: { pattern: RegExp; behavior: string; significance: string }[] = [
  {
    pattern: /(?:no\s+worries|no\s+problem|completely\s+understand|take\s+your\s+time|whenever\s+you['’]?re\s+ready)/i,
    behavior: 'Accepted stated comfort level without pushback',
    significance: 'Signals willingness to let communication develop at a mutually agreeable pace.',
  },
  {
    pattern: /(?:respect\s+your\s+(?:boundary|decision|comfort|space)|happy\s+to\s+wait)/i,
    behavior: 'Explicit acknowledgment of personal limits',
    significance: 'Demonstrates active recognition of personal comfort and autonomy.',
  },
  {
    pattern: /(?:public\s+place\s+(?:is\s+great|sounds\s+good|works\s+for\s+me)|coffee\s+shop\s+sounds\s+nice|crowded\s+spot)/i,
    behavior: 'Agreeing to a public first meetup venue',
    significance: 'Supports mutual physical safety precautions on an initial meeting.',
  },
  {
    pattern: /(?:no\s+pressure\s+at\s+all|your\s+pace|safety\s+first|comfortable\s+for\s+you)/i,
    behavior: 'Reassuring about absence of pressure',
    significance: 'Indicates calm, non-demanding communication.',
  },
  {
    pattern: /(?:sounds\s+great|how\s+about\s+you|what\s+do\s+you\s+think|good\s+to\s+know)/i,
    behavior: 'Balanced conversational reciprocity',
    significance: 'Reflects two-way engagement and curiosity rather than one-sided demands.',
  },
];

export class PatternService {
  /**
   * Evaluates conversation text against established pattern rules and user boundaries,
   * producing a truly dynamic, evidence-based report reflecting the actual chat messages.
   */
  public static analyzeConversation(
    text: string,
    userBoundaries: UserBoundaryItem[] = [],
    options: AnalysisOptions = {}
  ): StructuredAnalysisOutput {
    const findings: StructuredAnalysisOutput['findings'] = [];
    const evidenceList: string[] = [];
    let maxConcernScore = 1;
    const matchedSafetySteps: Set<string> = new Set();
    const possibleManipulationPatterns: StructuredAnalysisOutput['possibleManipulationPatterns'] = [];
    const positiveSignals: StructuredAnalysisOutput['positiveSignals'] = [];

    // Parse potential speakers in the dialogue
    const speakerMatches = Array.from(text.matchAll(/^([A-Za-z0-9_\-\s]{2,20}):\s*(.*)$/gm));
    const speakers = Array.from(new Set(speakerMatches.map((m) => m[1].trim())));

    // Default response options
    let gentleReply = "Thank you for sharing your thoughts. I appreciate us taking the time to communicate clearly.";
    let firmReply = "I value clear communication and want to ensure we both feel respected and comfortable.";
    let directReply = "I prefer to communicate directly and keep things comfortable and transparent.";

    // 1. Check all pattern rules against conversation text
    for (const rule of PATTERN_RULES) {
      for (const regex of rule.regexList) {
        const match = text.match(regex);
        if (match) {
          const excerpt = match[0];
          const quoted = `"${excerpt}"`;
          evidenceList.push(quoted);

          findings.push({
            category: rule.category,
            title: rule.title,
            evidence: quoted,
            explanation: rule.explanationTemplate(excerpt),
            confidence: rule.confidence,
            recommendedAction: rule.recommendedAction,
          });

          possibleManipulationPatterns.push({
            pattern: rule.title,
            evidence: quoted,
            explanation: rule.explanationTemplate(excerpt),
            uncertaintyNote: 'Derived from communicative evidence. Observe whether this reflects a consistent tactic or an isolated phrase.',
          });

          if (rule.concernScore > maxConcernScore) {
            maxConcernScore = rule.concernScore;
          }

          rule.safetyAdvice.forEach((step) => matchedSafetySteps.add(step));

          if (rule.replyOverrides) {
            gentleReply = rule.replyOverrides.gentle;
            firmReply = rule.replyOverrides.firm;
            directReply = rule.replyOverrides.direct;
          }
          break; // Avoid duplicate findings from the same rule category
        }
      }
    }

    // 2. Check explicitly defined user boundaries with granular status
    const boundaryAnalysis: StructuredAnalysisOutput['boundaryAnalysis'] = [];
    if (userBoundaries && userBoundaries.length > 0) {
      for (const boundary of userBoundaries) {
        const cat = boundary.category.toLowerCase();
        let matchCount = 0;
        let matchedExcerpt = '';

        for (const f of findings) {
          const isCategoryMatch =
            (cat === 'financial' && f.category === 'financial_pressure') ||
            (cat === 'physical_intimacy' && (f.category === 'photo_pressure' || f.category === 'isolation_location')) ||
            (cat === 'emotional_pace' && (f.category === 'emotional_guilt_trip' || f.category === 'rushed_commitment')) ||
            (cat === 'personal_privacy' && (f.category === 'channel_migration' || f.category === 'isolation_location')) ||
            (cat === 'communication' && (f.category === 'threats_intimidation' || f.category === 'gaslighting_invalidation'));

          if (isCategoryMatch) {
            matchCount++;
            if (!matchedExcerpt) matchedExcerpt = f.evidence;
          }
        }

        // Additional keyword matching
        if (matchCount === 0) {
          const titleWords = boundary.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
          const hasKeyword = titleWords.some((w) => text.toLowerCase().includes(w));
          if (cat === 'financial' && /\b(?:money|cash|send|transfer|venmo|cashapp|paypal|wire|loan|crypto|gift\s*card)\b/i.test(text)) {
            matchCount = 1;
            matchedExcerpt = 'Financial mention detected in dialogue';
          } else if (hasKeyword) {
            matchCount = 1;
            matchedExcerpt = 'Related topic mentioned in dialogue';
          }
        }

        if (matchCount >= 2) {
          boundaryAnalysis.push({
            boundaryTitle: boundary.title,
            status: 'Repeatedly challenged',
            evidenceExcerpt: matchedExcerpt,
            explanation: `Multiple points in the conversation indicate persistent pressure or conflict regarding "${boundary.title}".`,
            guidance: 'Firmly state your boundary once more or discontinue contact if pressure continues.',
          });
        } else if (matchCount === 1) {
          boundaryAnalysis.push({
            boundaryTitle: boundary.title,
            status: 'Possibly challenged',
            evidenceExcerpt: matchedExcerpt,
            explanation: `The text contains a message that appears in tension with "${boundary.title}".`,
            guidance: 'Clarify your boundary early before the conversation progresses further.',
          });
        } else {
          const hasRespect = RESPECTFUL_MARKERS.some((r) => r.pattern.test(text));
          if (hasRespect) {
            boundaryAnalysis.push({
              boundaryTitle: boundary.title,
              status: 'Appears respected',
              evidenceExcerpt: 'Respectful pacing observed in dialogue',
              explanation: `No indication of pressure regarding "${boundary.title}" was identified in the supplied text.`,
              guidance: 'Maintain clear awareness as the connection develops.',
            });
          } else {
            boundaryAnalysis.push({
              boundaryTitle: boundary.title,
              status: 'Not enough evidence',
              evidenceExcerpt: '',
              explanation: `This specific boundary was not actively discussed or tested in the provided excerpt.`,
              guidance: 'State this boundary proactively if this topic arises.',
            });
          }
        }
      }
    }

    // 3. Check for respectful / positive communication markers
    for (const marker of RESPECTFUL_MARKERS) {
      const m = text.match(marker.pattern);
      if (m) {
        positiveSignals.push({
          behavior: marker.behavior,
          evidence: `"${m[0]}"`,
          significance: marker.significance,
        });
      }
    }

    // 4. Generate dynamic, non-generic summary based on the actual participants and topics
    let summary = '';
    let concernLevel: 'low' | 'moderate' | 'high' = 'low';
    let evidenceStrength: 'weak' | 'moderate' | 'strong' = 'moderate';

    const speakerContext = speakers.length >= 2 ? `between ${speakers[0]} and ${speakers[1]}` : 'in the provided excerpt';

    if (maxConcernScore === 3) {
      concernLevel = 'high';
      evidenceStrength = findings.length >= 2 ? 'strong' : 'moderate';
      const topicsList = findings.map((f) => f.title.toLowerCase()).join(' and ');
      summary = `The analysis of the conversation ${speakerContext} identified elevated risk patterns, specifically regarding ${topicsList}. Evidence such as ${evidenceList.slice(0, 2).join(' and ')} indicates boundary pushback or pressure. Prioritize your safety, maintain independent transport, and do not compromise your comfort.`;
    } else if (maxConcernScore === 2) {
      concernLevel = 'moderate';
      evidenceStrength = 'moderate';
      const topicsList = findings.map((f) => f.title.toLowerCase()).join(' and ');
      summary = `The analysis observed moderate communication patterns ${speakerContext} that warrant mindful awareness, such as ${topicsList}. Review lines like ${evidenceList[0] || 'the pacing indicators'} to ensure your comfort is prioritized before advancing the interaction.`;
    } else {
      concernLevel = 'low';
      evidenceStrength = positiveSignals.length > 0 ? 'moderate' : 'weak';
      if (positiveSignals.length > 0) {
        const positiveList = positiveSignals.map((p) => p.evidence).join(', ');
        summary = `The conversation ${speakerContext} displays positive communication signals, including ${positiveList}. Stated comfort levels appear acknowledged with respectful pacing, and no concerning manipulation tactics were detected.`;
        matchedSafetySteps.add('Continue communicating at a measured, mutually comfortable pace.');
        matchedSafetySteps.add('When you decide to meet in person, select a busy public location and arrange your own transit.');
      } else {
        summary = `Based on the conversation ${speakerContext}, no prominent manipulation patterns, financial solicitations, or boundary pressures were flagged. Communication appears balanced; continue observing actions over time.`;
        matchedSafetySteps.add('Maintain your personal boundaries as communication continues.');
        matchedSafetySteps.add('Keep conversation on the platform until a foundation of mutual comfort is established.');
      }
    }

    if (matchedSafetySteps.size === 0) {
      matchedSafetySteps.add('Never share one-time security codes or sensitive passwords with anyone.');
      matchedSafetySteps.add('Meet first dates in populated public venues and inform a trusted friend.');
    }

    const limitations = [
      'This analysis is based solely on the text provided and cannot evaluate offline conduct or full relationship history.',
      'TrustLens cannot conclusively verify identity, background, or ultimate character.',
      'A low-concern indicator is not a guarantee of safety; maintain situational awareness.',
      'Delayed replies, concise answers, or simple disagreements do not automatically constitute manipulation.',
    ];

    const stepsArray = Array.from(matchedSafetySteps);
    const repliesObj = {
      gentle: gentleReply,
      firm: firmReply,
      direct: directReply,
    };

    return {
      summary,
      concernLevel,
      findings,
      evidence: evidenceList,
      evidenceStrength,
      boundaryAnalysis,
      boundaryChecks: boundaryAnalysis,
      possibleManipulationPatterns,
      positiveSignals,
      recommendedActions: stepsArray,
      safetySteps: stepsArray,
      suggestedReplies: repliesObj,
      replySuggestions: repliesObj,
      limitations,
      engine: 'pattern_rules_fallback',
    };
  }

  /**
   * Deep semantic analysis of user messages, separating new vs existing and extracting
   * topic, intent, key points, questions/requests, actionable insights, category & connection.
   */
  static analyzeUserMessages(
    newMessages: Array<{ id?: string; messageId?: string; role: string; content: string; timestamp?: string }>,
    existingMessages: Array<{ id?: string; messageId?: string; role: string; content: string; timestamp?: string; analysis?: any }> = [],
    _fullHistory: Array<{ role: string; content: string }> = []
  ) {
    const analyzeSingle = (
      msg: { id?: string; messageId?: string; role: string; content: string; timestamp?: string },
      idx: number
    ) => {
      const id = msg.id || msg.messageId || `user-msg-${Date.now()}-${idx}`;
      const content = msg.content.trim();
      const lower = content.toLowerCase();

      let category = 'General';
      let topic = 'Conversation Inquiry';
      let intent = 'Communicating thoughts and engaging in relationship dialogue.';
      const keyPoints: string[] = [];
      const questionsAndRequests: string[] = [];
      const actionableInsights: string[] = [];

      // Extract explicit questions
      const sentenceList = content.split(/(?<=[.?!])\s+/).filter(Boolean);
      sentenceList.forEach((s) => {
        if (s.includes('?') || /^(?:what|why|how|can|could|should|do|does|did|is|are|will|would)\b/i.test(s.trim())) {
          questionsAndRequests.push(s.trim());
        }
      });

      // Extract requests
      if (/^(?:please|can you|could you|help me|tell me|let me know)\b/i.test(lower)) {
        if (!questionsAndRequests.some((q) => q.toLowerCase() === content.toLowerCase())) {
          questionsAndRequests.push(content);
        }
      }

      // 1. Red Flag Inquiry / Pattern & Deception Assessment
      if (
        /(?:scam|red flag|warning|manipulat|suspicious|weird|catfish|trust|lie|honest|stock model|fake|are you real|who is in the photo)/i.test(lower)
      ) {
        category = 'Red Flag Inquiry';
        topic = 'Pattern Assessment & Deception Check';
        intent = 'Seeking objective analysis of potential warning signs or manipulative tactics.';
        keyPoints.push(`Evaluating authenticity or concerning patterns in conversation.`);
        actionableInsights.push('Compare words with actions: genuine romantic interest is consistent, calm, and does not require urgent crises.');
        actionableInsights.push('Trust your intuition: confusion or anxiety in early stages is often your brain processing incongruent signals.');
      }
      // 2. Boundary Setting
      else if (
        /(?:not comfortable|don['']?t feel comfortable|my boundary|personal rule|not ready|no thanks|prefer not to|won['']?t|cannot|take things slow|strict rule|do not give out|don['']?t give out|never give out|do not share|don['']?t share|never share|do not|don['']?t send)/i.test(lower)
      ) {
        category = 'Boundary Setting';
        topic = 'Enforcing Personal Dating Boundary';
        intent = 'Clearly establishing and asserting a personal limit without escalating.';
        keyPoints.push(`Explicitly declared boundary: "${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"`);
        actionableInsights.push('Maintain consistency: if the other person pushes against this boundary, treat that push as valuable behavioral data.');
        actionableInsights.push('You do not owe extensive justifications for your comfort levels.');
      }
      // 2. Financial Safety
      else if (
        /(?:money|cash|wire|transfer|lend|borrow|cashapp|venmo|zelle|crypto|invest|bank|dollars|\$)/i.test(lower)
      ) {
        category = 'Safety Verification';
        topic = 'Financial Boundaries & Asset Protection';
        intent = 'Addressing or questioning financial requests or money-related topics.';
        keyPoints.push(`Involved financial references: "${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"`);
        actionableInsights.push('Strict invariant: Never transfer money, cryptocurrency, or gift cards to someone you have not verified thoroughly in person.');
        actionableInsights.push('Watch for guilt-tripping or emergency claims designed to make you feel responsible for their hardships.');
      }
      // 3. Photo & Media Privacy
      else if (
        /(?:photo|picture|pic|snap|camera|video|selfie|nude|spicy|private)/i.test(lower)
      ) {
        category = 'Boundary Setting';
        topic = 'Media Privacy & Intimate Boundaries';
        intent = 'Navigating or limiting sharing of private imagery.';
        keyPoints.push(`Addressed visual sharing expectations: "${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"`);
        actionableInsights.push('Anyone who respects your character will comfortably wait until trust is firmly established before asking for intimate media.');
        actionableInsights.push('Decline once clearly. If repeated, remember that repeated pressure after a "no" is coercion.');
      }
      // 4. Meeting in Person & Transit
      else if (
        /(?:meet|coffee|public|dinner|drive|uber|transit|location|drink|date)/i.test(lower)
      ) {
        category = 'Practical Planning';
        topic = 'In-Person Meeting Logistics & Safety';
        intent = 'Discussing meeting arrangements or establishing first-date safety terms.';
        keyPoints.push(`Discussed in-person meetup details: "${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"`);
        actionableInsights.push('Always choose a populated, public venue for first meetups and arrange independent round-trip transportation.');
        actionableInsights.push('Share your live location or planned itinerary with a trusted friend before meeting.');
      }
      // 6. Emotional Expression
      else if (
        /(?:feel|uncomfortable|anxious|worried|scared|confused|overwhelmed|hurt|stress)/i.test(lower)
      ) {
        category = 'Emotional Expression';
        topic = 'Emotional Grounding & Pacing';
        intent = 'Expressing vulnerability or emotional response to relationship dynamics.';
        keyPoints.push('Articulated personal emotional state regarding the interaction.');
        actionableInsights.push('Give yourself permission to pause communication when feeling overwhelmed; urgency is rarely an authentic requirement.');
      }
      // Default / General
      else {
        category = 'Clarification';
        topic = 'General Communication';
        intent = 'Engaging in reciprocal conversation or asking for information.';
        keyPoints.push(content.length > 80 ? content.slice(0, 80) + '...' : content);
        actionableInsights.push('Continue maintaining open communication while remaining mindful of your comfort limits.');
      }

      if (keyPoints.length === 0) {
        keyPoints.push(`User message: "${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"`);
      }
      if (actionableInsights.length === 0) {
        actionableInsights.push('Monitor how the other party responds to your tone and pacing.');
      }

      // Check connection to existing messages
      let connectionToExisting = 'Standalone message in current dialogue.';
      if (existingMessages.length > 0) {
        const lastExisting = existingMessages[existingMessages.length - 1];
        if (lastExisting) {
          connectionToExisting = `Builds upon prior exchange regarding "${lastExisting.content.slice(0, 45)}..."`;
        }
      }

      const meaningAndContext = `In this message, the user communicates: "${content}". The tone is ${
        category === 'Boundary Setting' ? 'firm and protective of personal boundaries' :
        category === 'Safety Verification' ? 'cautious and security-conscious' :
        category === 'Red Flag Inquiry' ? 'analytical and seeking clarity' :
        'conversational and measured'
      }.`;

      return {
        messageId: id,
        role: 'user' as const,
        content,
        timestamp: msg.timestamp || new Date().toISOString(),
        meaningAndContext,
        topic,
        intent,
        keyPoints,
        questionsAndRequests,
        actionableInsights,
        category,
        connectionToExisting,
        analyzedAt: new Date().toISOString(),
      };
    };

    const newMessagesAnalysis = newMessages.map((m, idx) => analyzeSingle(m, idx));

    // Also enrich existing messages if they don't already have analysis details
    const existingMessagesAnalysis = existingMessages.map((m, idx) => {
      if (m.analysis && m.analysis.meaningAndContext) {
        return m.analysis;
      }
      return analyzeSingle(m, idx);
    });

    const allAnalyzed = [...existingMessagesAnalysis, ...newMessagesAnalysis];
    const primaryTopics = Array.from(new Set(allAnalyzed.map((item) => item.topic))).slice(0, 5);
    const hasBoundaries = allAnalyzed.some((item) => item.category === 'Boundary Setting');
    const hasFinancials = allAnalyzed.some((item) => item.category === 'Safety Verification');
    const hasInquiries = allAnalyzed.some((item) => item.category === 'Red Flag Inquiry');

    const safetyConcerns: string[] = [];
    if (hasFinancials) safetyConcerns.push('Financial matters or asset transfer references detected in dialogue.');
    if (hasInquiries) safetyConcerns.push('Concerns regarding suspicious conduct or manipulation raised.');
    if (safetyConcerns.length === 0) safetyConcerns.push('No acute safety threats detected in user messages; healthy dialogue observed.');

    const recommendedFocus: string[] = [
      'Uphold established boundaries consistently across all communication platforms.',
      'Refrain from moving to unmoderated off-platform channels prematurely.',
      'Take relationship progression at a steady, observable pace.',
    ];

    const overallSummary = `Analysis of ${allAnalyzed.length} user message(s) reflects ${
      hasBoundaries ? 'active boundary assertion and high personal agency' : 'measured conversational engagement'
    }. The user has focused primarily on ${primaryTopics.join(', ') || 'relationship safety'}.`;

    const userBoundaryPosture = hasBoundaries ? 'Proactive & Resilient' : 'Observant & Open';

    return {
      newMessagesAnalysis,
      existingMessagesAnalysis,
      overallAnalysis: {
        overallSummary,
        primaryTopics,
        safetyConcerns,
        recommendedFocus,
        totalAnalyzed: allAnalyzed.length,
        userBoundaryPosture,
      },
      engine: 'pattern_rules_fallback' as const,
    };
  }
}
