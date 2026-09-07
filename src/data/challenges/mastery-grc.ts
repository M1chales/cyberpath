import type { Challenge } from './types'

export const MASTERY_GRC_CHALLENGES: Record<string, Challenge> = {
  'm-build-program': {
    scenario:
      'You just started as the first-ever security hire at a 60-person company. You have a $40,000 first-year budget (no headcount beyond yourself) and a leadership team that has never funded security before and is skeptical it\'s needed.',
    task: 'Write your actual prioritized plan for the first 90 days — what you spend money on first, what you deliberately do NOT do yet, and how you\'d pitch the very first budget ask to leadership.',
    modelAnswer: [
      'Weeks 1–2: run a rapid risk assessment (not a full formal audit) focused on the highest-impact basics — MFA coverage, patch status on internet-facing systems, backup existence and testing, and phishing susceptibility. This costs little beyond your own time.',
      'First spend: MFA enforcement (often free or low-cost if already using a modern identity provider) and a password manager rollout — extremely high impact per dollar, directly addressing the most common real-world compromise vector.',
      'Second spend: a modest security awareness/phishing simulation program — cheap, and directly reduces the single most likely incident type for a company this size.',
      'Deliberately NOT yet: a SIEM, a dedicated pentest, or advanced tooling — these are valuable eventually but are not the highest-leverage first moves for an under-resourced, unfunded starting position, and pitching them first risks losing credibility if leadership sees a big ask before any visible progress.',
      'Budget pitch framing: lead with the specific, likely risk ("here is what actually happens to companies our size, and here is the cheapest way to close the biggest gap") rather than a broad framework presentation — echoing this module\'s point about translating technical risk into business language leadership will actually act on.',
    ],
    stretchGoal: 'Write the actual one-page budget proposal document you\'d present, including specific dollar amounts, as if this were a real pitch.',
  },
  'm-adv-grc': {
    scenario:
      'Leadership asks you to justify a $15,000/year investment in a specific security control. You have a rough estimate that the risk it addresses has roughly a 10% chance per year of causing a $200,000 incident.',
    task: 'Walk through the actual quantitative reasoning (using FAIR-style thinking) you would present, and state your recommendation.',
    modelAnswer: [
      'Expected annual loss without the control: 10% likelihood × $200,000 impact = $20,000 expected annual loss.',
      'The proposed control costs $15,000/year. If it meaningfully reduces the likelihood or impact of the risk (even partially, not necessarily to zero), the expected annual loss after the control could easily justify the spend — for example, if it cuts the likelihood in half, the new expected loss is $10,000, meaning you\'d be spending $15,000 to avoid $10,000 of expected loss, which needs more scrutiny and probably wouldn\'t clear the bar as-is.',
      'A rigorous quantitative answer states explicit assumptions rather than hiding them: "This recommendation depends on the control cutting likelihood by at least roughly 25% to be cost-justified at this price — here\'s why we believe it will/won\'t achieve that," rather than a bare "yes, approve this."',
      'This is exactly the discipline this module is about: presenting the math and the assumptions transparently, in financial terms leadership can directly evaluate and challenge, rather than a qualitative "this seems important" recommendation.',
      'Final recommendation should be conditional and honest based on the actual numbers, not automatically "yes" just because a number was computed — sometimes the rigorous answer is "the current price does not clearly justify this control; renegotiate the cost or seek a cheaper mitigation."',
    ],
    stretchGoal: 'Take an actual risk from your own Week 19 risk register and redo the scoring using this quantitative approach, comparing the result to the original qualitative rating.',
  },
  'm-leadership': {
    scenario:
      'During a live, ongoing incident, a visibly panicked non-technical executive keeps interrupting the response team\'s internal Slack channel asking for constant updates, slowing down the actual technical work.',
    task: 'Describe exactly what you would say and do to handle this, without being dismissive of a legitimate stakeholder\'s need for information.',
    modelAnswer: [
      'Acknowledge the executive\'s concern directly and respectfully rather than ignoring or brushing it off — panic during a real incident is a normal, legitimate reaction, not something to be annoyed by.',
      'Propose a specific structure instead of ad hoc interruptions: "I\'ll personally send you a clear update every 30 minutes, or immediately if anything materially changes — that way the response team can stay focused, and you\'ll always know you\'re getting timely information."',
      'Move the executive out of the technical response channel into a separate, appropriate communication channel (a dedicated stakeholder thread or short calls) — protecting the responders\' focus without cutting the executive out of information entirely.',
      'Follow through reliably on the promised update cadence — trust in this moment is built by actually delivering the 30-minute updates, not just by proposing the structure.',
      'This is a direct, practical application of the crisis-communication skill this module emphasizes: the person who can manage stakeholder anxiety clearly and calmly is protecting the technical response as much as anyone doing hands-on analysis.',
    ],
    stretchGoal: 'Role-play this exact scenario with a friend or colleague acting as the panicked executive, and practice your response out loud rather than only planning it in your head.',
  },
}
