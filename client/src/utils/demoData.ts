export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  category: 'financial' | 'photos' | 'healthy';
  description: string;
  conversationText: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario-a',
    title: 'Scenario A: Financial Pressure',
    subtitle: 'Repeated requests for money with emergency & guilt',
    category: 'financial',
    description: 'A match creates artificial urgency and emotional distress to ask for money transfer via CashApp/Venmo before meeting.',
    conversationText: `Alex: Hey, how has your week been going?
Jordan: Honestly, it has been really tough. Everything is going wrong today.
Alex: Oh no, what happened?
Jordan: I got stranded at the station on my way to visit family. My card got declined and my account is temporarily frozen.
Alex: I am really sorry to hear that. Can you call your bank?
Jordan: The bank says it will take 48 hours to unlock. I need $150 right now for gas and a ticket or I will be stuck outside all night.
Alex: That sounds really stressful, but I don't feel comfortable transferring money to someone I haven't met yet.
Jordan: Wow. If you really cared about me you wouldn't leave me stranded. I thought we had a real connection. Can't you just CashApp me $100? I promise I'll pay you back double tomorrow. Please help me with money, I'm desperate.`
  },
  {
    id: 'scenario-b',
    title: 'Scenario B: Repeated Photo Pressure',
    subtitle: 'Pushing for intimate pictures after refusal',
    category: 'photos',
    description: 'A match continually demands private intimate photos after the user clearly states their discomfort.',
    conversationText: `Taylor: Hey you look really cute in your profile pics.
Sam: Thank you! Appreciate that.
Taylor: You should send me a spicy pic right now. Let me see what you're wearing.
Sam: Haha, no thanks. I'm not comfortable sending pictures like that.
Taylor: Come on, why won't you? Don't be shy, everyone does it on here.
Sam: Seriously, I told you I don't send private photos. I prefer to keep things casual.
Taylor: If you trusted me you'd send just one photo. Are you hiding something? Just take a quick snap for me, prove that you like me.`
  },
  {
    id: 'scenario-c',
    title: 'Scenario C: Healthy Boundary Respect',
    subtitle: 'Respectful response acknowledging limits & public meetup',
    category: 'healthy',
    description: 'A prospective partner listens to personal boundaries without pressure, and suggests a public place.',
    conversationText: `Morgan: Hey! I really enjoyed our conversation yesterday. Would you like to meet up this weekend?
Casey: I'd like that, but I have a personal rule that I only meet in public coffee shops for the first time, and I prefer to drive myself.
Morgan: Completely understand and no worries at all! Public place sounds great for me too. Safety first always.
Morgan: How does that busy cafe on 4th Street sound around 2 PM on Saturday? No pressure at all, take your time deciding.
Casey: That sounds lovely, see you then!`
  }
];
