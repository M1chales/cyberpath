import type { Challenge } from './types'

export const MASTERY_OFFENSE_CHALLENGES: Record<string, Challenge> = {
  'm-adv-exploit': {
    scenario:
      'Mid-engagement, on an authorized pentest, you discover a finding that would let you pivot into the client\'s payroll database — well beyond the agreed scope of "external web application only." The client\'s CEO happens to be someone you personally know.',
    task: 'Describe exactly what you do next, in order, and explain why stopping here (if that\'s your answer) is not "giving up" on the engagement\'s value.',
    modelAnswer: [
      'Stop actively pursuing the finding immediately — do not pivot into the payroll database, regardless of how easy or tempting it is, because it is outside the signed scope and would be unauthorized access.',
      'Document the finding precisely as far as you legitimately went (the point at which further access would exceed scope) without actually exploiting further.',
      'Contact the engagement\'s designated point of contact (not necessarily the CEO directly, and not skipping process because you know them personally) to report the finding and ask whether the client wants to formally expand scope to test it.',
      'This is not "giving up" — a finding this severe, reported responsibly and precisely at the scope boundary, is often more valuable to the client than an unauthorized deeper compromise, and it preserves the trust relationship that makes future engagements (and your reputation) possible.',
      'Personal relationships with the client are exactly why the formal process matters more here, not less — acting outside scope "because you know them" is a bigger, not smaller, professional and legal risk.',
    ],
    stretchGoal: 'Draft the actual written finding you would put in the report for this scenario, including a clear "recommend re-scoping to test this further" note for the client.',
  },
  'm-redteam-ops': {
    scenario:
      'Three days into an authorized, month-long red team engagement, the blue team detects and fully contains your access — much faster than expected. Your engagement lead asks: "do we quietly try to regain access using a different technique, or is the exercise over?"',
    task: 'Give your actual recommendation and reasoning, tying back to what a red team engagement is actually supposed to measure.',
    modelAnswer: [
      'Recommend stopping and treating this as a genuinely valuable outcome, not a failure to work around — the objective of a red team engagement is measuring real detection and response capability, and a fast, effective containment is exactly the finding leadership needs to hear.',
      'Quietly trying to regain access without informing the appropriate deconfliction contact would risk being mistaken for a real, ongoing intrusion by a blue team that believes the threat is now over — a serious safety and trust violation of the engagement\'s rules.',
      'The correct move if there is genuine appetite to test further scenarios is to explicitly renegotiate: pause, debrief this finding, and if leadership wants to test additional techniques, restart with proper deconfliction and communication, not quietly attempt to "win" the current exercise.',
      'Frame the result for the report as a strength to highlight (fast detection and effective containment) alongside whatever gaps allowed the initial three days of access to occur in the first place.',
    ],
    stretchGoal: 'Write the actual after-action report summary for this scenario, balancing what went well for the defenders with what still needs improvement.',
  },
  'm-appsec-mastery': {
    scenario:
      'While testing a GraphQL API during an authorized engagement, you discover that a single deeply nested query can retrieve every user\'s private data in one request — no authentication bypass, just a complex, valid query that no one anticipated.',
    task: 'Explain why this is still a serious finding even though it "wasn\'t hacking" in the traditional sense, and describe the fix at both the immediate and architectural level.',
    modelAnswer: [
      'This is a serious finding because it is a genuine authorization failure — the query is technically "valid" but returns data the requester was never supposed to access; complexity of the request does not change the fact that access control failed.',
      'This is exactly the kind of business-logic and per-field authorization gap this module\'s lesson specifically calls out as unique to GraphQL — a REST-focused security review would likely have missed it entirely.',
      'Immediate fix: enforce field-level authorization so that even a valid, well-formed query cannot return data the requester is not authorized to see, regardless of how the query is structured.',
      'Architectural fix: add query complexity/depth limiting to prevent both this type of over-fetching and related denial-of-service risks from extremely nested queries.',
      'Report this with a clear technical explanation for developers who may not think of "a valid query returning too much data" as a security bug in the way they think of a typical injection vulnerability — the framing matters for getting it actually fixed.',
    ],
    stretchGoal: 'Set up a small GraphQL API in your lab, deliberately without field-level authorization, and reproduce this exact class of finding yourself.',
  },
}
