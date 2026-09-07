import type { Lesson } from './types'

export const MASTERY_OFFENSE_LESSONS: Record<string, Lesson> = {
  'm-adv-exploit': {
    intro:
      'Week 11 got you a single foothold on a single deliberately vulnerable box. Real engagements rarely stop there — the actual value of a pentest is understanding how several individually minor findings chain into serious business impact, and reporting that chain clearly enough that someone can actually fix it.',
    builtOn: ['Week 11 — Exploitation Basics & Metasploit Lab', 'Week 8 — Identity, Access & Active Directory Security'],
    sections: [
      {
        heading: 'Chaining and pivoting',
        paragraphs: [
          'A single low-severity finding (a service running with slightly excessive permissions, a shared local admin password) is often unremarkable alone. Chaining several such findings together — using access from one host to pivot into a network segment you could not otherwise reach — is how real attackers, and real pentesters, turn "minor issues" into full compromise. This is the direct, larger-scale extension of the privilege escalation and lateral movement concepts from Weeks 8 and 11.',
        ],
      },
      {
        heading: 'Living-off-the-land',
        paragraphs: [
          'Rather than dropping custom malware that antivirus might catch by signature (recall Week 7\'s AV vs. EDR discussion), living-off-the-land techniques abuse legitimate, already-installed system tools (PowerShell, WMI, built-in admin utilities) to carry out malicious actions — which is exactly why Week 7\'s point about EDR watching behavior, not just signatures, matters so much at this level of sophistication.',
        ],
      },
      {
        heading: 'Scoping discipline under pressure',
        paragraphs: [
          'The moment a chain of findings starts looking like a genuinely serious compromise path, the temptation to keep going "just a bit further" is strongest — and exactly when strict adherence to the written scope and rules of engagement from Week 9 matters most. A finding you cannot legally pursue further is still a valid, reportable finding.',
        ],
        callout: {
          label: 'The real discipline being tested here',
          text: 'Anyone can follow a tutorial to root a lab box. What separates a professional is stopping precisely at the agreed boundary even when the exploit chain clearly continues — and writing that up as clearly as the parts you did complete.',
        },
      },
    ],
    takeaways: [
      'Real business impact usually comes from chaining minor findings, not from one dramatic exploit.',
      'Living-off-the-land techniques evade signature-based detection by using tools that are already legitimately present.',
      'Scoping discipline is hardest to maintain exactly when a chain is working — which is exactly why it matters most there.',
      'A hands-on certification like the OSCP is a reasonable external check once this feels routine, not a replacement for the lab reps themselves.',
    ],
  },

  'm-redteam-ops': {
    intro:
      'Week 11\'s exploitation and Week 9\'s scoped reconnaissance were both about finding and proving vulnerabilities quickly. Red teaming is a different objective entirely: simulating a patient, quiet, real adversary over an extended engagement, measuring whether an organization\'s people and detection — not just its patch level — would actually catch a determined attacker.',
    builtOn: ['Week 9 — Reconnaissance & Vulnerability Scanning', 'Week 11 — Exploitation Basics & Metasploit Lab', 'Week 14 — Threat Detection & MITRE ATT&CK'],
    sections: [
      {
        heading: 'Red team vs. pentest',
        paragraphs: [
          'A pentest (Weeks 9–11\'s core skill) typically asks "how many vulnerabilities can we find in this scope, in this time?" A red team engagement asks a narrower, objective-based question instead — "could a real adversary reach this specific crown-jewel asset without being detected?" — often starting from an assumed-breach position rather than external reconnaissance.',
        ],
      },
      {
        heading: 'Command-and-control infrastructure, conceptually',
        paragraphs: [
          'C2 infrastructure is how an operator maintains control over compromised systems throughout an engagement — using redirectors to hide the true origin of traffic and staging infrastructure to distribute tools, all while thinking carefully about operational security so the infrastructure itself does not become a giveaway. You do not need to build production C2 tooling to understand this conceptually — recognizing this infrastructure is exactly what your Week 14 detection engineering work is trying to catch on the defensive side.',
        ],
      },
      {
        heading: 'Engagement planning and deconfliction',
        paragraphs: [
          'Because a red team engagement is deliberately trying to evade detection, a small group of stakeholders (rarely the full blue team) needs to know it is happening, precisely so that a real incident occurring simultaneously is not mistaken for the exercise — deconfliction. Safety controls (a stop condition, an emergency contact) are non-negotiable parts of the plan, not afterthoughts.',
        ],
      },
      {
        heading: 'Reporting as narrative',
        paragraphs: [
          'Where a pentest report is often a findings list, a red team report tells a story: how the assumed breach progressed, what was and was not detected at each stage, and what that means for organizational risk — closer to the case-study format you built for your Week 20 capstone than to a vulnerability scan output.',
        ],
      },
    ],
    takeaways: [
      'Red teaming asks "could a real adversary reach this asset undetected," not "how many bugs exist in scope."',
      'C2 infrastructure and operational security are what this specialization asks you to understand and detect, not weaponize irresponsibly.',
      'Deconfliction and safety controls are core plan requirements, not optional extras.',
      'A red team report is a narrative of what happened and what it means for risk — never practiced without explicit written authorization.',
    ],
  },

  'm-appsec-mastery': {
    intro:
      'Week 10 covered the OWASP Top 10 — the vulnerability classes every web application needs to defend against. Modern applications, especially API-first and microservice architectures, have their own additional failure modes that a Top-10 checklist alone will miss entirely.',
    builtOn: ['Week 10 — Web Application Security — OWASP Top 10'],
    sections: [
      {
        heading: 'Beyond the Top 10: the OWASP API Security Top 10',
        paragraphs: [
          'APIs (especially REST and GraphQL) have their own dedicated vulnerability list, because the attack surface differs from a traditional web page: there is no browser enforcing anything, so every check the client-side code appears to make must be independently verified server-side — the same lesson as Week 10\'s Burp Suite section, taken further.',
        ],
      },
      {
        heading: 'Business logic flaws and authorization at scale',
        paragraphs: [
          'IDOR (Week 10) generalizes at the API level into Broken Object Level Authorization (BOLA) — the single most common real-world API vulnerability class, because it requires no exotic technique, only understanding what the application\'s business logic is supposed to prevent and testing whether it actually does.',
        ],
      },
      {
        heading: 'GraphQL-specific attack surface',
        paragraphs: [
          'GraphQL lets a client request exactly the data fields it wants in a single flexible query — powerful, but it also means authorization has to be enforced per-field rather than per-endpoint, and a single complex query can sometimes be crafted to cause disproportionate server load (a denial-of-service angle unique to this style of API).',
        ],
      },
      {
        heading: 'Source-assisted review and bug bounty methodology',
        paragraphs: [
          'Where Week 10 was mostly black-box (testing without seeing the code), source-assisted review means grep-ing through actual application source for dangerous patterns (unsafe deserialization, string-built queries) directly — often faster and more thorough than black-box testing alone. Public bug bounty programs are the best real-world practice ground for all of this: expect duplicate and rejected reports before your first accepted one, and treat that feedback as the actual training.',
        ],
      },
    ],
    takeaways: [
      'APIs need their own vulnerability checklist because there is no browser enforcing client-side assumptions.',
      'BOLA is IDOR generalized to APIs, and remains one of the most common real-world findings.',
      'GraphQL needs per-field authorization and query-complexity limits, not just per-endpoint checks.',
      'Source-assisted review complements black-box testing; bug bounty rejection/duplicate feedback is where this skill actually sharpens.',
    ],
  },
}
