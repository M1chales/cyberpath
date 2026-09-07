import type { Lesson } from './types'

export const MASTERY_BLUETEAM_LESSONS: Record<string, Lesson> = {
  'm-hunting': {
    intro:
      'The core path taught you to build detections reactively — Week 13\'s SIEM, Week 14\'s ATT&CK-mapped rules. Threat hunting flips that: instead of waiting for a detection to fire, you go looking for evidence of an attacker who is already past your existing defenses, on the assumption that some of them always are.',
    builtOn: ['Week 13 — SOC Operations & SIEM Fundamentals', 'Week 14 — Threat Detection & MITRE ATT&CK'],
    sections: [
      {
        heading: 'Three hunting methodologies',
        paragraphs: [
          'A hypothesis-based hunt starts from a question ("if an attacker was using this specific technique, what would it look like in our data?") rather than an existing alert. An IOC-based hunt searches for specific known-bad artifacts across your environment, retroactively — useful the moment new threat intelligence arrives. A TTP-based hunt (the most durable of the three, echoing Week 14\'s point about TTPs outlasting individual IOCs) looks for behavioral patterns regardless of the specific tool an attacker used to produce them.',
        ],
      },
      {
        heading: 'Detection-as-code',
        paragraphs: [
          'Treating detection rules as version-controlled code — reviewed, tested, and deployed like any other software artifact — rather than ad hoc queries typed directly into a SIEM console, is what lets a team\'s detection coverage scale and survive staff turnover. This also makes false-positive tuning a tracked, iterative process instead of a one-off tweak someone forgets to document.',
        ],
      },
      {
        heading: 'Sigma: writing detections once, running them anywhere',
        paragraphs: [
          'Sigma is a generic, YAML-based rule format that can be translated into the query language of whatever SIEM you actually run (Splunk, Elastic, and others). Writing detections in Sigma first, and only then translating to your specific platform, is what lets a hunter\'s work be shared across the entire community rather than locked to one vendor\'s syntax — directly analogous to how you learned Week 13\'s SIEM concepts in a way that transfers between Splunk and ELK.',
        ],
        code: 'title: SSH Failed Password Attempt\nlogsource:\n  product: linux\n  service: auth\ndetection:\n  selection:\n    message|contains: "Failed password"\n  condition: selection\nlevel: low',
        codeLabel: 'A base Sigma detection rule for the raw event',
      },
      {
        heading: 'From a single event to a threshold with Sigma correlations',
        paragraphs: [
          'The base rule above matches one failed-password event — turning that into "five or more within a minute," the brute-force pattern from Week 13, is a separate layer in Sigma: a correlation rule references the base rule by name and adds an event_count type, a group-by field (e.g. source IP), and a timespan, rather than embedding a count directly inside the detection block. Keeping the raw-event rule and the threshold logic separate is what lets the same base rule be reused across several different correlations.',
        ],
      },
    ],
    takeaways: [
      'TTP-based hunts are the most durable because attacker behavior changes far less than any single indicator.',
      'Detection-as-code turns ad hoc queries into reviewed, tracked, shareable artifacts.',
      'Sigma decouples "what to detect" from "which SIEM you happen to run," and separates raw-event rules from threshold correlations.',
      'This module compounds with volume — the first several dozen hunts mostly teach you what your own environment\'s noise looks like.',
    ],
  },

  'm-threat-intel': {
    intro:
      'Week 14 introduced IOCs, TTPs, and feeds as inputs to detection. This module goes deeper into where that intelligence actually comes from, how to judge whether it is trustworthy, and how to turn it into something a defender can act on rather than just another report nobody reads.',
    builtOn: ['Week 14 — Threat Detection & MITRE ATT&CK'],
    sections: [
      {
        heading: 'The intelligence cycle',
        paragraphs: [
          'Professional threat intelligence follows a repeatable cycle: direction (what questions actually matter to this organization), collection (gathering raw information), processing (making it usable), analysis (turning data into judgment), and dissemination (getting the right conclusion to the right person in time to act on it). Skipping "direction" is the most common failure mode — collecting interesting information nobody actually needed.',
        ],
      },
      {
        heading: 'Strategic, operational, and tactical intelligence',
        paragraphs: [
          'Strategic intelligence informs long-term decisions ("should we worry about this industry-wide threat trend?"), operational intelligence informs medium-term planning ("this actor is currently targeting our sector"), and tactical intelligence is the immediate, technical detail (an IOC, a specific TTP) that a SOC analyst acts on today. A good intel brief is written for the right altitude — a CISO does not need a file hash, and a Tier 1 analyst does not need geopolitical context.',
        ],
      },
      {
        heading: 'The Diamond Model, confidence, and structured analytic techniques',
        paragraphs: [
          'The Diamond Model frames every intrusion event as four connected points — adversary, capability, infrastructure, and victim — useful for reasoning about attribution beyond the Kill Chain\'s purely sequential view. Because attribution is genuinely difficult, professional analysts use structured estimative language ("likely," "high confidence," "assessed with low confidence") rather than false certainty, and structured analytic techniques (like deliberately considering alternative explanations) to guard against confirmation bias.',
        ],
        callout: {
          label: 'The actual discipline here',
          text: 'Being right about attribution is genuinely hard, even for well-resourced professionals. Being honest and precise about your confidence level is the skill you can reliably control — and it is the one that matters most when someone acts on your brief.',
        },
      },
    ],
    takeaways: [
      'The intelligence cycle starts with direction — collecting information nobody asked for is the most common failure.',
      'Match the altitude of your brief to the audience: strategic, operational, or tactical.',
      'The Diamond Model adds adversary/capability/infrastructure/victim structure to the sequential Kill Chain view.',
      'Structured, honest confidence language is more valuable than false certainty — attribution is hard even for professionals.',
    ],
  },

  'm-purple-team': {
    intro:
      'Week 14 had you simulate individual ATT&CK techniques with Atomic Red Team and check your own detections. Purple teaming formalizes that same loop into a structured, recurring practice — done collaboratively, with a real red-team-style adversary emulation, and tracked over time rather than as a one-off exercise.',
    builtOn: ['Week 14 — Threat Detection & MITRE ATT&CK', 'm-hunting — Detection Engineering & Proactive Threat Hunting'],
    sections: [
      {
        heading: 'Adversary emulation planning',
        paragraphs: [
          'Rather than testing detections against generic techniques, an adversary emulation plan specifically replicates the known TTPs of a real, documented threat actor relevant to your organization\'s industry — turning "can we detect a brute-force login" into "could we detect this specific ransomware group\'s actual playbook." MITRE publishes several such plans publicly as a starting point.',
        ],
      },
      {
        heading: 'Scoping and stakeholder buy-in',
        paragraphs: [
          'A purple team exercise needs the same rules-of-engagement discipline from Week 9, plus something extra: because the defensive side is knowingly involved, deconfliction (making sure nobody outside the exercise mistakes it for a real incident) and clear stakeholder buy-in matter enormously — this is collaborative testing, not a surprise.',
        ],
      },
      {
        heading: 'Scoring coverage over time',
        paragraphs: [
          'Rather than a one-off pass/fail, mature purple teaming tracks an ATT&CK coverage score (recall Week 14\'s heat map) exercise over exercise, proving detection improvement is real and durable rather than anecdotal. Facilitation matters here too: keeping the exercise genuinely collaborative, not an adversarial "gotcha" between red and blue, is what makes teams actually want to run it again.',
        ],
      },
    ],
    takeaways: [
      'Adversary emulation plans replicate a specific, real threat actor\'s TTPs, not generic techniques.',
      'Purple teaming needs deconfliction and stakeholder buy-in precisely because the defensive side already knows.',
      'Tracking coverage scores exercise over exercise turns "we did a purple team once" into a real, measurable improvement trend.',
      'This specialization requires being trusted by both offense and defense — a trust built over real projects, not one exercise.',
    ],
  },
}
