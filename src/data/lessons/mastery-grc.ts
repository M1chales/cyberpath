import type { Lesson } from './types'

export const MASTERY_GRC_LESSONS: Record<string, Lesson> = {
  'm-build-program': {
    intro:
      'Week 19 taught you the vocabulary of governance and risk. This module puts that vocabulary to work in the hardest real version of the job: being the first and only security person at an organization, with a real budget cap and a leadership team that has never funded this before.',
    builtOn: ['Week 19 — Governance, Risk, Compliance & Law'],
    sections: [
      {
        heading: 'Prioritizing when you cannot fix everything',
        paragraphs: [
          'Every organization has more risks than budget to address them — the risk assessment skill from Week 19 becomes existential here, not academic. The first 90 days are about identifying the handful of highest-impact, most-likely risks (a phishing-vulnerable workforce, unpatched internet-facing systems, no backup strategy) and fixing those first, resisting the pull toward whatever tool or framework is currently fashionable.',
        ],
      },
      {
        heading: 'Translating technical risk into business risk',
        paragraphs: [
          'Leadership rarely responds to "we have unpatched CVEs" the way they respond to "a ransomware incident would likely cost us two weeks of downtime and this much revenue, based on what happened to a comparable company last year." This translation — the same skill from the security-leadership module\'s crisis communication, applied to funding requests instead of live incidents — is what actually secures budget.',
        ],
      },
      {
        heading: 'Frameworks as scaffolding, not scripture',
        paragraphs: [
          'NIST CSF or the CIS Controls (from Week 19) are useful starting scaffolding for a new program — they prevent you from missing an entire category of risk — but a 50-person company implementing every control at the same maturity level as a Fortune 500 bank is wasted effort. Use the framework to check completeness, then prioritize ruthlessly based on your actual risk assessment.',
        ],
      },
      {
        heading: 'Vendor and tool selection under real constraints',
        paragraphs: [
          'A real budget forces real tradeoffs: free and open-source tools (many of which you have already used throughout this course — Suricata, OpenVAS, the ELK stack) versus paid platforms, and which single hire or contractor would multiply your own effectiveness the most. This is the genuinely constrained, real-world version of the mostly-unconstrained lab environment the rest of this course has used.',
        ],
      },
    ],
    takeaways: [
      'The first 90 days are about the highest-impact risks first, not comprehensive coverage.',
      'Translating technical risk into business-impact language is what actually secures funding.',
      'Use frameworks as scaffolding for completeness, then prioritize based on your own risk assessment — not uniform, maximal implementation.',
      'This role has outsized impact precisely because it decides what everyone else in the organization ends up working on.',
    ],
  },

  'm-adv-grc': {
    intro:
      'Week 19 introduced risk registers scored qualitatively (a red/yellow/green heat map). This module pushes into quantitative risk thinking and the deeper regulatory and vendor-risk work that a mature security program eventually needs.',
    builtOn: ['Week 19 — Governance, Risk, Compliance & Law'],
    sections: [
      {
        heading: 'Quantitative risk: the FAIR model, conceptually',
        paragraphs: [
          'A qualitative "high/medium/low" risk rating is fast but hard to compare directly against a dollar-denominated budget request. Quantitative approaches like the FAIR model instead estimate risk in terms of probable financial loss over a time period, letting you directly compare "the cost of this control" against "the expected cost of the risk it reduces" — a far more persuasive conversation with a CFO than a colored heat map.',
        ],
      },
      {
        heading: 'Audit readiness at scale',
        paragraphs: [
          'Passing a real compliance audit (against frameworks introduced in Week 19, like PCI-DSS or ISO 27001) means having evidence — logs, policies, records of actual practice, not just documents describing intended practice — ready and organized well before an auditor asks for it. Building audit readiness continuously, rather than scrambling right before an audit, is what separates a mature program from one that is only compliant on paper.',
        ],
      },
      {
        heading: 'Third-party and vendor risk',
        paragraphs: [
          'An organization\'s security is only as strong as its weakest connected vendor — a lesson many real breaches have taught the industry the hard way. A vendor risk management program systematically assesses suppliers (often through a security questionnaire) before granting them access to data or systems, and periodically thereafter, rather than trusting a vendor once at onboarding and never revisiting it.',
        ],
      },
      {
        heading: 'Choosing regulatory depth deliberately',
        paragraphs: [
          'Regulatory expertise (deep HIPAA knowledge for healthcare, deep PCI-DSS knowledge for payments) is genuinely industry-specific — trying to become a generalist expert across every regulation in Week 19\'s overview is both unrealistic and unnecessary. Pick the regulations that actually govern your target industry and go deep there.',
        ],
      },
    ],
    takeaways: [
      'Quantitative risk models translate risk into financial terms leadership can directly weigh against cost.',
      'Audit readiness is a continuous practice, not a scramble before the audit date.',
      'A vendor risk program treats third-party access as an ongoing risk to manage, not a one-time onboarding check.',
      'Go deep on the regulations that actually apply to your target industry rather than trying to master all of them generally.',
    ],
  },

  'm-leadership': {
    intro:
      'Every technical and governance skill in this entire course — core path and mastery track alike — is only as useful as your ability to communicate it clearly, mentor others through it, and be trusted with it. This closing module is deliberately about that, because it is the actual top of the mastery pyramid, not a technical afterthought.',
    builtOn: ['Week 16 — Incident Response: Plan, Contain, Eradicate, Recover', 'Week 19 — Governance, Risk, Compliance & Law'],
    sections: [
      {
        heading: 'Crisis communication',
        paragraphs: [
          'During a real incident (recall Week 16\'s communication-plan discussion), the person who can explain what is happening, what is being done, and what is still unknown — clearly, calmly, and honestly, to people who are frightened and not technical — is often more valuable in the moment than the person doing the deepest technical analysis. This is a practiced skill, not an innate trait, and it is trained the same way a tabletop exercise trains incident response: by rehearsing it before it matters.',
        ],
      },
      {
        heading: 'Mentoring as a skill in itself',
        paragraphs: [
          'Mentoring someone else through a real problem by asking questions rather than handing over answers does two things at once: it builds their independent judgment, and it forces you to articulate your own reasoning clearly enough to test whether you actually understand it as well as you assumed. This is exactly why this module\'s practice exercise has you mentor someone through a core-path module using only questions.',
        ],
      },
      {
        heading: 'Building a visible, verifiable track record',
        paragraphs: [
          'Write-ups, talks, and open-source contributions are not vanity metrics — they are how a hiring manager, a client, or a worried neighbor can verify your competence before trusting you with something real, in exactly the same way your Week 20 portfolio proved your core-path skills. This should be an ongoing habit that extends the Week 20 portfolio work indefinitely, not a one-time project you finish and set aside.',
        ],
      },
      {
        heading: 'Community as the actual infrastructure of reputation',
        paragraphs: [
          'Local BSides conferences, community meetups, and online communities are where reputations and job referrals in this field actually form — far more than any single certification. Showing up consistently, contributing honestly (including admitting the limits of your own knowledge), and helping other people succeed is, over years, what makes you the person someone actually calls first.',
        ],
      },
    ],
    takeaways: [
      'Clear crisis communication is a practiced, trainable skill, and often more valuable in the moment than the deepest technical analysis alone.',
      'Mentoring by asking questions builds someone else\'s judgment while testing the depth of your own understanding.',
      'A visible, honest track record — write-ups, talks, contributions — is how competence gets verified by people who were not there to see you build it.',
      'Reputation in this field is built in community, consistently, over years — this is the actual, final answer to "how do I become the first call."',
    ],
  },
}
