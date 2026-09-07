import type { ModuleQuiz } from './types'

export const MASTERY_OFFENSE_QUIZZES: Record<string, ModuleQuiz> = {
  'm-adv-exploit': [
    {
      question: 'What does "chaining" mean in advanced exploitation?',
      options: [
        'Running the same exploit repeatedly against one host',
        'Combining several individually minor findings to achieve serious business impact',
        'Encrypting the connection between attacker and victim',
        'Using only one tool for an entire engagement',
      ],
      correctIndex: 1,
      explanation: 'Real-world impact often comes from combining several unremarkable findings rather than one dramatic single exploit.',
    },
    {
      question: 'Why do living-off-the-land techniques often evade signature-based detection?',
      options: [
        'They only run on air-gapped networks',
        'They abuse already-installed, legitimate system tools instead of dropping new, flaggable malware',
        'They require physical access to succeed',
        'They are always encrypted with unbreakable ciphers',
      ],
      correctIndex: 1,
      explanation: 'Using legitimate tools like PowerShell or WMI blends in with normal administrative activity, unlike custom malware with a matchable signature.',
    },
    {
      question: 'What does this module say is the correct action when a finding falls outside the agreed scope, even if an exploit chain clearly continues?',
      options: [
        'Continue anyway if the client would probably appreciate it',
        'Stop at the boundary and report the finding as-is',
        'Ask for permission after the fact',
        'Delete the finding since it cannot be pursued further',
      ],
      correctIndex: 1,
      explanation: 'Scoping discipline matters most exactly when a chain is working — stopping at the agreed line is still a valid, reportable finding.',
    },
    {
      question: 'What is the recommended role of a certification like the OSCP in this specialization?',
      options: [
        'It should be attempted before any hands-on lab practice',
        'An external check on skill once lab reps already feel routine, not a replacement for practice',
        'It replaces the need for scoping discipline',
        'It is required before any exploitation practice is legal',
      ],
      correctIndex: 1,
      explanation: 'A hands-on cert is best pursued as validation of skill already built through repeated, real lab practice.',
    },
  ],
  'm-redteam-ops': [
    {
      question: 'What is the key difference between a penetration test and a red team engagement?',
      options: [
        'A pentest is always longer than a red team engagement',
        'A pentest asks "how many vulnerabilities exist in scope"; a red team asks "could a real adversary reach this specific asset undetected"',
        'Red teams never use exploits',
        'Pentests are illegal without a red team present',
      ],
      correctIndex: 1,
      explanation: 'Red teaming is objective-based and often starts from an assumed-breach position, focused on detection rather than vulnerability count.',
    },
    {
      question: 'What is the purpose of "deconfliction" in a red team engagement?',
      options: [
        'To make the exercise louder and easier to detect',
        'To ensure a small group of stakeholders can distinguish the planned exercise from a real, simultaneous incident',
        'To remove the need for written authorization',
        'To speed up the engagement timeline',
      ],
      correctIndex: 1,
      explanation: 'Because the engagement is intentionally stealthy, a few informed stakeholders must be able to tell it apart from a genuine incident.',
    },
    {
      question: 'What is C2 (command-and-control) infrastructure used for?',
      options: [
        'Encrypting a company\'s entire database',
        'Maintaining an operator\'s control over compromised systems throughout an engagement',
        'Scanning for open ports only',
        'Generating written reports automatically',
      ],
      correctIndex: 1,
      explanation: 'C2 infrastructure (with redirectors and staging) is how an operator manages compromised systems over the course of an engagement.',
    },
    {
      question: 'Under what conditions does this module say red team techniques may ever be practiced?',
      options: [
        'Against any publicly accessible website for research purposes',
        'Only against systems you own or have explicit written authorization to test',
        'Anytime, as long as no data is deleted',
        'Against competitors\' systems if it reveals a security flaw',
      ],
      correctIndex: 1,
      explanation: 'This is the highest-trust specialization in the field precisely because it is only ever practiced with explicit, written authorization.',
    },
  ],
  'm-appsec-mastery': [
    {
      question: 'What is BOLA (Broken Object Level Authorization) essentially the API-scale version of?',
      options: ['SQL injection', 'IDOR (Insecure Direct Object Reference)', 'Cross-Site Scripting', 'DNS spoofing'],
      correctIndex: 1,
      explanation: 'BOLA generalizes the IDOR concept from Week 10 to API endpoints, and remains one of the most common real-world API findings.',
    },
    {
      question: 'Why does GraphQL require authorization to be enforced per-field rather than per-endpoint?',
      options: [
        'GraphQL does not support authorization at all',
        'A single flexible query can request many different data fields at once, so each field needs its own check',
        'GraphQL only has one endpoint by design, with no fields',
        'Per-field authorization is never actually necessary in practice',
      ],
      correctIndex: 1,
      explanation: 'Because a GraphQL query can request an arbitrary combination of fields, authorization has to be checked at the field level, not just the endpoint.',
    },
    {
      question: 'What is "source-assisted review" in this context?',
      options: [
        'Testing an application purely by clicking through its UI',
        'Reviewing actual application source code directly (e.g. grep-ing for dangerous patterns), rather than only black-box testing',
        'Reading marketing material about an application',
        'Using only automated scanners with no manual review',
      ],
      correctIndex: 1,
      explanation: 'Source-assisted review examines the real code for dangerous patterns, often catching issues black-box testing alone would miss.',
    },
    {
      question: 'What does the module say is the actual training value of duplicate or rejected bug bounty reports?',
      options: [
        'They have no value and should be avoided entirely',
        'The feedback loop from rejections and duplicates is what sharpens this skill over time',
        'They guarantee a payout eventually regardless of quality',
        'They indicate the program itself is fraudulent',
      ],
      correctIndex: 1,
      explanation: 'Expect duplicates and rejections before your first accepted report — that feedback is genuinely part of the learning process.',
    },
  ],
}
