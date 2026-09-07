import type { ModuleQuiz } from './types'

export const MASTERY_BLUETEAM_QUIZZES: Record<string, ModuleQuiz> = {
  'm-hunting': [
    {
      question: 'Which hunting methodology is described as the most durable, because it does not depend on any single indicator?',
      options: ['IOC-based hunting', 'TTP-based hunting', 'Hypothesis-based hunting only', 'Signature-based hunting'],
      correctIndex: 1,
      explanation: 'TTP-based hunts look for behavioral patterns regardless of the specific tool used, making them more durable than IOC-based approaches.',
    },
    {
      question: 'What is the main benefit of "detection-as-code"?',
      options: [
        'It eliminates the need for a SIEM',
        'Detection rules become version-controlled, reviewed, and trackable artifacts rather than ad hoc queries',
        'It only works with Sigma rules',
        'It automatically writes new detections without human input',
      ],
      correctIndex: 1,
      explanation: 'Treating detections as code lets coverage scale and survive staff turnover, with changes reviewed and tracked like any other software.',
    },
    {
      question: 'What is the main advantage of writing a detection in the Sigma format first?',
      options: [
        'Sigma rules run faster than native SIEM queries',
        'It can be translated into the query language of whatever SIEM you actually run, making it portable',
        'Sigma is the only format that supports thresholds',
        'Sigma rules do not need to be tested',
      ],
      correctIndex: 1,
      explanation: 'Sigma decouples "what to detect" from "which platform you use," letting a rule be shared and reused across different SIEMs.',
    },
    {
      question: 'What does the module say to expect from your first 50 real threat hunts?',
      options: [
        'They will each uncover a confirmed attacker',
        'They will mostly teach you what your own environment\'s normal noise looks like',
        'They should be skipped in favor of automated tools only',
        'They require no documentation',
      ],
      correctIndex: 1,
      explanation: 'This skill compounds with volume — early hunts are mostly about learning to distinguish real signal from your own environment\'s baseline noise.',
    },
  ],
  'm-threat-intel': [
    {
      question: 'What is the first, and most commonly skipped, step in the intelligence cycle?',
      options: ['Dissemination', 'Direction', 'Analysis', 'Collection'],
      correctIndex: 1,
      explanation: 'Skipping "direction" — defining what questions actually matter — leads to collecting information nobody actually needed.',
    },
    {
      question: 'Which type of intelligence would a Tier 1 SOC analyst most directly act on today?',
      options: ['Strategic intelligence', 'Tactical intelligence', 'Boardroom intelligence', 'Historical intelligence'],
      correctIndex: 1,
      explanation: 'Tactical intelligence is the immediate, technical detail (an IOC or specific TTP) that an analyst uses right now.',
    },
    {
      question: 'Why does the module recommend structured estimative language like "likely" or "high confidence" instead of definitive statements?',
      options: [
        'It sounds more professional but has no real function',
        'Attribution is genuinely difficult even for professionals, so honest, precise confidence levels matter more than false certainty',
        'It is a legal requirement in every country',
        'It eliminates the need for evidence entirely',
      ],
      correctIndex: 1,
      explanation: 'Being honest and precise about confidence is the controllable, disciplined part of intelligence work — attribution itself is often uncertain.',
    },
    {
      question: 'What four connected points does the Diamond Model use to frame an intrusion event?',
      options: [
        'Time, location, cost, and damage',
        'Adversary, capability, infrastructure, and victim',
        'Network, host, cloud, and mobile',
        'Detection, response, recovery, and review',
      ],
      correctIndex: 1,
      explanation: 'The Diamond Model links adversary, capability, infrastructure, and victim as four connected facets of any single intrusion event.',
    },
  ],
  'm-purple-team': [
    {
      question: 'What distinguishes an adversary emulation plan from a generic penetration test?',
      options: [
        'It uses no real techniques at all',
        'It specifically replicates the known TTPs of a real, documented threat actor relevant to the organization',
        'It never involves the blue team',
        'It only tests physical security',
      ],
      correctIndex: 1,
      explanation: 'Adversary emulation targets a specific real actor\'s known behavior, rather than testing generic techniques.',
    },
    {
      question: 'Why does purple teaming require deconfliction that a standard pentest does not emphasize as strongly?',
      options: [
        'Because purple team exercises are always fully automated',
        'Because the defensive side already knows testing is happening, so a real incident occurring simultaneously must not be confused with the exercise',
        'Deconfliction is not actually needed in purple teaming',
        'Because purple teams never use real techniques',
      ],
      correctIndex: 1,
      explanation: 'Since defenders are aware, clear communication prevents a genuine incident from being mistaken for the planned exercise, or vice versa.',
    },
    {
      question: 'What should be tracked across multiple purple team exercises over time?',
      options: [
        'Only the number of participants',
        'ATT&CK coverage score, to prove detection improvement is real and durable rather than anecdotal',
        'The cost of snacks provided during the exercise',
        'Nothing — each exercise should be treated independently',
      ],
      correctIndex: 1,
      explanation: 'Tracking coverage scores exercise over exercise turns purple teaming into measurable, ongoing improvement rather than a one-off event.',
    },
    {
      question: 'What does this module say is required to succeed as a purple team practitioner long-term?',
      options: [
        'Working entirely alone without collaboration',
        'Being trusted by both the offensive and defensive sides, built over real projects',
        'Avoiding all contact with the blue team',
        'Only ever running fully automated exercises',
      ],
      correctIndex: 1,
      explanation: 'This role requires credibility with both red and blue teams, which is earned through real collaborative work over time.',
    },
  ],
}
