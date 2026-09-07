import type { Challenge } from './types'

export const MASTERY_BLUETEAM_CHALLENGES: Record<string, Challenge> = {
  'm-hunting': {
    scenario:
      'Your organization just read a report that a threat actor targeting your industry frequently uses scheduled tasks for persistence, created via schtasks.exe with unusual, randomized task names. You have no existing detection for this.',
    task: 'Write a hypothesis-based hunt plan: the specific hypothesis, what data source you would query, and what you would consider a genuine finding versus normal IT admin noise.',
    modelAnswer: [
      'Hypothesis: "If this actor\'s TTP is present in our environment, we should see schtasks.exe creating tasks with randomized or non-descriptive names, likely outside normal patch/deployment windows."',
      'Data source: endpoint process creation logs (Sysmon Event ID 1, or EDR process telemetry) filtered for schtasks.exe with a /create argument, correlated with the parent process that spawned it.',
      'Genuine finding markers: task names that look randomly generated (not matching your organization\'s naming conventions for legitimate scheduled tasks), created by an unusual parent process (e.g. a browser or Office app rather than an installer or admin tool), or created outside your normal change-management window.',
      'Noise to expect and rule out: legitimate software installers and update mechanisms create scheduled tasks constantly — you will need a baseline of what "normal" scheduled task creation looks like in your environment before this hunt is usable at all.',
      'If nothing is found: document the hypothesis, the query, and the negative result just as carefully as a positive one — this is what "detection-as-code" and disciplined hunting actually looks like over time.',
    ],
    stretchGoal: 'Simulate this exact technique with Atomic Red Team in your lab, then write and test the actual detection rule that would have caught it, converting it to Sigma format for portability.',
  },
  'm-threat-intel': {
    scenario:
      'A colleague forwards you a blog post claiming "Nation-State Group X is targeting our industry" based on a single indicator: a malicious IP address that also briefly appeared in an unrelated commodity-malware campaign.',
    task: 'Write your actual assessment of this claim, including the confidence level you would assign it and why, using this week\'s structured analytic thinking.',
    modelAnswer: [
      'A single shared IOC (one IP address) is extremely weak evidence for attribution — IP infrastructure is frequently reused, sold, or coincidentally shared across completely unrelated campaigns (bulletproof hosting, shared VPS providers).',
      'Proper assessment should explicitly state a low confidence level, something like: "Assessed with low confidence that this activity is linked to Group X, based solely on a single shared, easily-changed indicator with no corroborating TTP overlap."',
      'Before raising this internally as a real threat, you would want to check for actual TTP overlap (recall: TTPs are far more durable and meaningful than IOCs) — does the observed activity match this group\'s known tools, infrastructure patterns, or objectives beyond just one IP?',
      'The responsible action is not to dismiss the blog post entirely, but to correctly calibrate how much organizational alarm and resource allocation it deserves — likely "worth monitoring for corroborating evidence," not "activate incident response."',
    ],
    stretchGoal: 'Find a real, publicly reported attribution claim and try to independently verify or challenge it using only open sources — note how often even professional reporting conflates weak IOC overlap with confident attribution.',
  },
  'm-purple-team': {
    scenario:
      'You are planning your organization\'s first purple team exercise. Leadership is enthusiastic but wants to see it prove that "the SOC is doing a good job" — implicitly suggesting the exercise should be designed to succeed.',
    task: 'Write how you would push back on this framing (professionally) and describe how you would actually design the exercise\'s objectives instead.',
    modelAnswer: [
      'Push back by reframing the goal: the value of a purple team exercise is in finding gaps, not confirming success — an exercise designed to "prove" the SOC is good will be tuned (consciously or not) to avoid uncovering real problems, defeating its own purpose.',
      'Suggest instead framing success as "we found N specific gaps and closed them" — a genuinely more impressive and useful outcome to report to leadership than "we detected everything," which is also less credible.',
      'Design the exercise around a real adversary emulation plan relevant to your industry (not techniques hand-picked because you know they\'ll be caught), with the SOC not told in advance exactly what will be simulated or when.',
      'Build in explicit coverage scoring from the start (recall this module\'s point about tracking coverage over multiple exercises) so the first exercise establishes an honest baseline, not an inflated one.',
      'Present the eventual results to leadership as a coverage trend over time across future quarterly exercises, not a one-time pass/fail grade — this also sets the right long-term expectation.',
    ],
    stretchGoal: 'Design a full one-page adversary emulation plan for a real, relevant threat actor to your (hypothetical or real) industry, ready to actually run in your lab.',
  },
}
