import type { ModuleQuiz } from './types'

export const MASTERY_GRC_QUIZZES: Record<string, ModuleQuiz> = {
  'm-build-program': [
    {
      question: 'What should the first 90 days of a new security program focus on, according to this module?',
      options: [
        'Implementing every control in a framework at maximum maturity immediately',
        'The handful of highest-impact, most-likely risks first',
        'Only buying the newest available security tools',
        'Waiting for a major incident before taking any action',
      ],
      correctIndex: 1,
      explanation: 'With more risks than budget to address, prioritizing the highest-impact, most-likely risks first is what actually reduces danger fastest.',
    },
    {
      question: 'What is the most effective way to secure budget from leadership, according to this module?',
      options: [
        'Listing every unpatched CVE in technical detail',
        'Translating technical risk into business-impact language, such as expected downtime and cost',
        'Requesting the maximum possible budget without justification',
        'Comparing yourself unfavorably to competitors',
      ],
      correctIndex: 1,
      explanation: 'Leadership responds far better to concrete business-impact framing than to a list of technical findings alone.',
    },
    {
      question: 'How should frameworks like NIST CSF or CIS Controls be used for a small organization, according to this module?',
      options: [
        'Implemented at the same maturity level as a large enterprise, regardless of size',
        'As scaffolding to check completeness, then prioritized based on the organization\'s actual risk assessment',
        'Ignored entirely in favor of custom, unstructured approaches',
        'Only relevant to publicly traded companies',
      ],
      correctIndex: 1,
      explanation: 'Frameworks prevent missing an entire risk category, but implementation should be prioritized realistically, not applied uniformly regardless of scale.',
    },
    {
      question: 'Why does this module describe the "build a program" role as having outsized impact?',
      options: [
        'It requires no technical knowledge at all',
        'It decides what everyone else in the security function ends up working on',
        'It is the only role that touches actual technology',
        'It has no interaction with leadership',
      ],
      correctIndex: 1,
      explanation: 'By setting priorities and roadmap, this role shapes the effectiveness of every other security effort in the organization.',
    },
  ],
  'm-adv-grc': [
    {
      question: 'What advantage does a quantitative risk model (like FAIR) have over a red/yellow/green heat map?',
      options: [
        'It requires no data at all',
        'It expresses risk in financial terms that can be directly compared against the cost of a proposed control',
        'It eliminates the need for any risk assessment',
        'It is always more accurate regardless of data quality',
      ],
      correctIndex: 1,
      explanation: 'Financial-terms risk estimates allow a direct, persuasive comparison against the cost of mitigating controls.',
    },
    {
      question: 'What does "audit readiness" mean in a mature security program?',
      options: [
        'Scrambling to gather evidence right before an audit is scheduled',
        'Maintaining organized evidence of actual practice continuously, not just intended practice',
        'Avoiding all audits whenever possible',
        'Only documenting policies without ever verifying practice',
      ],
      correctIndex: 1,
      explanation: 'Continuous audit readiness — real evidence of practice, always organized — separates a mature program from one that is only compliant on paper.',
    },
    {
      question: 'What is the core purpose of a vendor/third-party risk management program?',
      options: [
        'To assess suppliers once at onboarding and never again',
        'To systematically assess and periodically re-assess vendors who have access to data or systems',
        'To eliminate the need for any vendor contracts',
        'To only apply to vendors located in the same country',
      ],
      correctIndex: 1,
      explanation: 'An organization is only as secure as its weakest connected vendor — ongoing, not one-time, assessment is what a real program requires.',
    },
    {
      question: 'How should regulatory depth be approached, according to this module?',
      options: [
        'Try to become an expert in every regulation across every industry',
        'Go deep specifically on the regulations relevant to your target industry',
        'Regulatory knowledge is not useful in GRC work',
        'Only focus on regulations from your home country',
      ],
      correctIndex: 1,
      explanation: 'Regulatory expertise is genuinely industry-specific — depth in your relevant industry beats broad, shallow coverage of everything.',
    },
  ],
  'm-leadership': [
    {
      question: 'What does this module say about crisis communication as a skill?',
      options: [
        'It is an innate trait that cannot be developed',
        'It is a practiced, trainable skill, rehearsed the same way a tabletop exercise trains incident response',
        'It matters less than technical skill during a live incident',
        'It only matters after an incident is fully resolved',
      ],
      correctIndex: 1,
      explanation: 'Clear communication under pressure is trained through deliberate practice, not something people either have or lack permanently.',
    },
    {
      question: 'Why does mentoring by asking questions (rather than giving answers) benefit the mentor as well?',
      options: [
        'It does not benefit the mentor at all',
        'It forces the mentor to articulate their own reasoning clearly enough to test whether they truly understand it',
        'It saves time compared to explaining directly',
        'It is only useful for very junior mentees',
      ],
      correctIndex: 1,
      explanation: 'Explaining your own reasoning well enough for someone else to use it is a genuine test of whether you understand it as well as assumed.',
    },
    {
      question: 'What does the module say write-ups, talks, and open-source contributions actually accomplish?',
      options: [
        'They serve no professional purpose beyond personal satisfaction',
        'They let a hiring manager or client verify your competence before trusting you with something real',
        'They are only valuable if monetized directly',
        'They replace the need for any hands-on lab practice',
      ],
      correctIndex: 1,
      explanation: 'A visible, honest track record is how outside observers verify skill they did not personally watch you build.',
    },
    {
      question: 'According to this closing module, how is the "first call" reputation actually built?',
      options: [
        'Through a single impressive certification',
        'Consistently, publicly, and honestly, over years, within a real community',
        'By working in complete isolation from other practitioners',
        'By never admitting the limits of your own knowledge',
      ],
      correctIndex: 1,
      explanation: 'Reputation in this field is built the same way anywhere: consistent, honest, visible contribution over a long period of time.',
    },
  ],
}
