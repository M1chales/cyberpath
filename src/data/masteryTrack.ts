import type { MasteryTrackDef } from './types'

// The Mastery Track is deliberately NOT organized into fixed weeks. Real mastery in
// any of these specializations is measured in years of applied practice, not a
// syllabus — this track is a map of what to learn and practice next, in whatever
// order matches the career direction chosen after the 5-month core path.
export const MASTERY_TRACK: MasteryTrackDef[] = [
  {
    id: 'blue-team-mastery',
    title: 'Advanced Blue Team & Threat Hunting',
    color: '#a3e635',
    summary: 'Going from "responds to alerts" to "finds the attacker before the alert fires."',
    modules: [
      {
        id: 'm-hunting',
        kind: 'mastery',
        title: 'Detection Engineering & Proactive Threat Hunting',
        tagline: 'Stop waiting for alerts — go looking for what your tools missed.',
        objectives: [
          'Build hypothesis-driven hunts instead of relying only on existing alerts.',
          'Write and tune high-fidelity detections that survive real production noise.',
          'Measure and improve detection coverage over time.',
        ],
        topics: [
          'Hunting methodologies (hypothesis-based, IOC-based, TTP-based)',
          'Detection-as-code and version-controlled detection rules',
          'False-positive tuning at production scale',
          'Data source prioritization (what to log, what actually matters)',
          'Sigma rules and cross-platform detection formats',
        ],
        practice: [
          'Run a structured hunt each month against your own lab or a public dataset, and log hypotheses that failed as carefully as ones that succeeded.',
          'Convert 10 of your detections into Sigma rules so they are portable across SIEMs.',
          'Join a threat-hunting CTF or exercise and compare your process notes against the winning write-ups afterward.',
        ],
        resources: [
          { label: 'SANS — Threat Hunting resources', url: 'https://www.sans.org/' },
          { label: 'Sigma rule repository', url: 'https://github.com/SigmaHQ/sigma' },
        ],
        realWorldNote: 'This skill compounds with volume. Expect your first 50 real hunts to mostly teach you what noise looks like.',
      },
      {
        id: 'm-threat-intel',
        kind: 'mastery',
        title: 'Threat Intelligence & Attribution',
        tagline: 'Turning "who is doing this and why" into decisions your team can act on.',
        objectives: [
          'Distinguish strategic, operational, and tactical threat intelligence.',
          'Evaluate the reliability of an intelligence source before acting on it.',
          'Produce a threat intel brief that changes what a defender actually does.',
        ],
        topics: [
          'The intelligence cycle (direction, collection, processing, analysis, dissemination)',
          'Diamond Model and Cyber Kill Chain as attribution tools',
          'Open-source intelligence (OSINT) tradecraft and its limits',
          'Confidence levels and structured analytic techniques',
          'Threat intel platforms and feed evaluation',
        ],
        practice: [
          'Track one real, publicly reported threat actor or campaign for a month using only open sources.',
          'Write a one-page intel brief with a clear "so what" recommendation, not just facts.',
          'Practice structured estimative language (e.g. "likely," "high confidence") and defend your confidence levels to a peer.',
        ],
        resources: [
          { label: 'MITRE ATT&CK Groups', url: 'https://attack.mitre.org/groups/' },
          { label: 'CISA Advisories', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories' },
        ],
        realWorldNote: 'Attribution is genuinely hard and often wrong even for professionals — the discipline here is honesty about confidence, not certainty.',
      },
      {
        id: 'm-purple-team',
        kind: 'mastery',
        title: 'Purple Teaming at Scale',
        tagline: 'Deliberately closing the loop between attackers and defenders on the same team.',
        objectives: [
          'Run a structured purple team exercise from planning to remediation.',
          'Use adversary emulation plans mapped to a real threat actor\'s known TTPs.',
          'Track detection coverage improvements exercise over exercise.',
        ],
        topics: [
          'Adversary emulation planning (MITRE ATT&CK-based)',
          'Exercise scoping, rules of engagement, and stakeholder buy-in',
          'Coverage scoring and tracking over multiple exercises',
          'Facilitation skills: keeping red and blue collaborative, not adversarial',
        ],
        practice: [
          'Design and run one full adversary-emulation purple team exercise in your lab, end to end, with a written after-action report.',
          'Repeat quarterly and chart your detection coverage improving over time.',
        ],
        resources: [
          { label: 'MITRE ATT&CK Emulation Plans', url: 'https://attack.mitre.org/resources/adversary-emulation-plans/' },
        ],
        realWorldNote: 'This role requires being trusted by both offense and defense — that trust is built over real projects, not a single course module.',
      },
    ],
  },
  {
    id: 'offense-mastery',
    title: 'Offensive Security Mastery',
    color: '#f97316',
    summary: 'From "can run a known exploit in a lab" to "can chain novel weaknesses into real impact under scope and time pressure."',
    modules: [
      {
        id: 'm-adv-exploit',
        kind: 'mastery',
        title: 'Advanced Exploitation & Post-Exploitation',
        tagline: 'The gap between "found a vulnerability" and "understood the blast radius."',
        objectives: [
          'Chain multiple low-severity findings into a high-impact attack path.',
          'Perform structured post-exploitation without breaking scope or causing damage.',
          'Write findings that a defender can actually reproduce and fix.',
        ],
        topics: [
          'Attack path chaining and pivoting between hosts/networks',
          'Living-off-the-land techniques and why they evade signature detection',
          'Credential access and lateral movement (advanced, defense-aware)',
          'Scoping discipline: staying inside rules of engagement under pressure',
          'Report writing that developers and executives can both use',
        ],
        practice: [
          'Complete a full multi-host lab environment (e.g. a "pro lab" style range) end to end and write a professional-grade report, not just a walkthrough.',
          'Pursue the OSCP or an equivalent hands-on certification once your lab reps feel routine, as an external check on your skill.',
        ],
        resources: [
          { label: 'OffSec — PEN-200 / OSCP path', url: 'https://www.offsec.com/courses/pen-200/' },
          { label: 'HackTheBox Pro Labs', url: 'https://www.hackthebox.com/' },
        ],
        realWorldNote: 'A real pentest is bounded by scope, time, and client trust — the discipline of stopping at the line matters as much as the technical skill.',
      },
      {
        id: 'm-redteam-ops',
        kind: 'mastery',
        title: 'Red Team Operations & C2 Fundamentals',
        tagline: 'Simulating a patient, quiet adversary over weeks — not a loud smash-and-grab.',
        objectives: [
          'Explain how command-and-control (C2) infrastructure works and why operational security matters to an operator.',
          'Plan a red team engagement with clear objectives distinct from a vulnerability-focused pentest.',
          'Understand detection evasion concepts well enough to help blue teams close the gaps — never to cause real-world harm.',
        ],
        topics: [
          'Red team vs. pentest: objectives-based engagements, assumed breach',
          'C2 architecture concepts (redirectors, staging, operational security)',
          'Engagement planning: objectives, deconfliction with blue team, safety controls',
          'Reporting an engagement as a narrative, not just a findings list',
        ],
        practice: [
          'Run a fully scoped, authorized assumed-breach exercise in your own isolated lab, focused on objectives rather than "get every box."',
          'Debrief the exercise as if presenting to leadership: what was achieved, what it means for risk, not just technique lists.',
        ],
        resources: [
          { label: 'MITRE ATT&CK — Command and Control tactic', url: 'https://attack.mitre.org/tactics/TA0011/' },
        ],
        realWorldNote: 'Only ever practiced against systems you own or have explicit written authorization to test. This is the highest-trust specialization in the field for a reason.',
      },
      {
        id: 'm-appsec-mastery',
        kind: 'mastery',
        title: 'Web & API Security Mastery',
        tagline: 'Past the OWASP Top 10 into the vulnerability classes that actually show up in modern apps.',
        objectives: [
          'Assess modern API architectures (REST, GraphQL) for authorization and business-logic flaws.',
          'Perform manual source-code-assisted testing, not just black-box scanning.',
          'Explain vulnerability classes specific to microservices and single-page apps.',
        ],
        topics: [
          'API security beyond OWASP Top 10 (OWASP API Security Top 10)',
          'Business logic flaws and authorization bugs (BOLA/IDOR at scale)',
          'GraphQL-specific attack surface',
          'Source-assisted review workflow (grep-driven, not just tool-driven)',
          'Bug bounty methodology and disclosure etiquette',
        ],
        practice: [
          'Work through advanced labs (e.g. PortSwigger Web Security Academy\'s hardest tracks) until you can solve them without hints.',
          'Participate in a public bug bounty program on an in-scope target and submit at least one well-written report, even if it is a duplicate.',
        ],
        resources: [
          { label: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security' },
          { label: 'OWASP API Security Top 10', url: 'https://owasp.org/API-Security/' },
        ],
        realWorldNote: 'Expect a lot of duplicate/rejected bug bounty reports before your first accepted one — that feedback loop is the actual training.',
      },
    ],
  },
  {
    id: 'forensics-mastery',
    title: 'Digital Forensics & Malware Analysis Mastery',
    color: '#38bdf8',
    summary: 'From "ran a tool against an image" to "can tell a court-defensible story from evidence."',
    modules: [
      {
        id: 'm-adv-forensics',
        kind: 'mastery',
        title: 'Advanced Memory, Disk & Timeline Forensics',
        tagline: 'Reconstructing exactly what happened, in what order, defensibly.',
        objectives: [
          'Build a full forensic timeline correlating multiple evidence sources.',
          'Explain anti-forensic techniques and how to detect them.',
          'Present findings in a way that would hold up to cross-examination.',
        ],
        topics: [
          'Super-timeline construction (Plaso/log2timeline)',
          'Filesystem-level artifacts (journaling, shadow copies, deleted data recovery)',
          'Anti-forensic techniques: timestomping, log clearing, wiping — and their traces',
          'Report writing and chain-of-custody standards that survive legal scrutiny',
        ],
        practice: [
          'Build a super-timeline from a multi-source evidence set (disk + memory + logs) and identify the full attacker dwell time.',
          'Deliberately tamper with timestamps on a test system, then detect your own tampering using artifact analysis.',
        ],
        resources: [
          { label: 'SANS FOR508 course description (self-study the public syllabus)', url: 'https://www.sans.org/cyber-security-courses/advanced-incident-response-threat-hunting-training/' },
          { label: 'Plaso / log2timeline', url: 'https://plaso.readthedocs.io/' },
        ],
        realWorldNote: 'Legal defensibility is a real skill, distinct from the technical analysis — study how evidence gets challenged in real cases.',
      },
      {
        id: 'm-malware-re',
        kind: 'mastery',
        title: 'Malware Reverse Engineering',
        tagline: 'Reading what the malware actually does, not just what a sandbox report says it did.',
        objectives: [
          'Perform static analysis of a binary using a disassembler.',
          'Perform safe dynamic analysis in a fully isolated sandbox.',
          'Read x86/x64 assembly well enough to identify core malicious logic.',
        ],
        topics: [
          'x86/x64 assembly fundamentals and calling conventions',
          'Static analysis tooling (disassemblers, decompilers)',
          'Dynamic analysis and sandboxing (network-isolated VMs, snapshotting)',
          'Common packing/obfuscation techniques and unpacking approaches',
          'Identifying persistence, C2, and exfiltration logic in a sample',
        ],
        practice: [
          'Analyze a known, publicly documented malware sample (never live/unknown samples) fully offline in a disposable, network-isolated VM.',
          'Write a malware analysis report matching the structure real vendors publish (behavior, IOCs, MITRE ATT&CK mapping).',
        ],
        resources: [
          { label: 'Practical Malware Analysis (book, widely used foundational text)' },
          { label: 'MalwareBazaar (samples for authorized, isolated research)', url: 'https://bazaar.abuse.ch/' },
        ],
        realWorldNote: 'Never run untrusted samples outside a fully isolated, snapshotted, network-disconnected environment. This is the one area where a lab mistake has real consequences.',
      },
      {
        id: 'm-cloud-mobile-forensics',
        kind: 'mastery',
        title: 'Cloud & Mobile Forensics',
        tagline: 'Evidence now lives in SaaS logs and phones as often as it lives on a laptop disk.',
        objectives: [
          'Collect and interpret forensic evidence from major cloud platforms.',
          'Explain the unique challenges of mobile device forensics.',
          'Understand the jurisdictional and legal complexity of cloud evidence.',
        ],
        topics: [
          'Cloud provider audit logs (CloudTrail, Azure Activity Log, Workspace/M365 audit logs)',
          'Ephemeral infrastructure and evidence-preservation challenges',
          'Mobile forensics fundamentals (logical vs. physical acquisition, encryption challenges)',
          'Cross-jurisdiction legal considerations for cloud evidence',
        ],
        practice: [
          'Simulate an incident in your free-tier cloud account and reconstruct it purely from native audit logs.',
          'Study a publicly documented cloud-breach case study and rebuild its timeline from the public post-mortem.',
        ],
        resources: [
          { label: 'AWS CloudTrail documentation', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/' },
        ],
        realWorldNote: 'Cloud evidence disappears fast on default retention settings — knowing what to preserve immediately is often more valuable than deep analysis skill.',
      },
    ],
  },
  {
    id: 'cloud-appsec-mastery',
    title: 'Cloud & Application Security Mastery',
    color: '#22d3ee',
    summary: 'Securing the infrastructure and pipelines that most organizations now actually run on.',
    modules: [
      {
        id: 'm-multicloud',
        kind: 'mastery',
        title: 'Multi-Cloud Security Architecture',
        tagline: 'Beyond one account\'s settings — designing security into the architecture itself.',
        objectives: [
          'Design a landing-zone architecture with security boundaries built in from the start.',
          'Compare identity, networking, and logging models across AWS, Azure, and GCP.',
          'Apply infrastructure-as-code security scanning to a real template.',
        ],
        topics: [
          'Landing zones, account/subscription/project segmentation strategies',
          'Cross-cloud IAM patterns and federation',
          'Infrastructure-as-code (Terraform/CloudFormation) security scanning',
          'Centralized logging and detection across multiple cloud providers',
        ],
        practice: [
          'Design (on paper, then partially build on free tiers) a multi-account landing zone with clear security boundaries.',
          'Run an IaC scanner (e.g. Checkov, tfsec) against a Terraform project and fix every finding.',
        ],
        resources: [
          { label: 'AWS Landing Zone guidance', url: 'https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html' },
          { label: 'Checkov (IaC scanner)', url: 'https://www.checkov.io/' },
        ],
        realWorldNote: 'Cloud misconfiguration is currently one of the single largest real-world breach causes — this specialization has outsized practical impact.',
      },
      {
        id: 'm-container-security',
        kind: 'mastery',
        title: 'Container & Kubernetes Security',
        tagline: 'Securing the layer most teams deploy to daily and understand least.',
        objectives: [
          'Harden a container image and a Kubernetes cluster against common misconfigurations.',
          'Explain the container escape and privilege-escalation risk model.',
          'Use admission controllers and policy-as-code to enforce security at deploy time.',
        ],
        topics: [
          'Container image hardening and supply-chain scanning',
          'Kubernetes RBAC, network policies, and pod security standards',
          'Container escape techniques and mitigations',
          'Policy-as-code (OPA/Gatekeeper, Kyverno)',
        ],
        practice: [
          'Stand up a local Kubernetes cluster (kind/minikube), deploy a deliberately vulnerable app, then lock it down layer by layer.',
          'Write a policy that blocks a specific insecure deployment pattern from ever being deployed.',
        ],
        resources: [
          { label: 'Kubernetes hardening guide (CIS Benchmark)', url: 'https://www.cisecurity.org/benchmark/kubernetes' },
          { label: 'OWASP Kubernetes Top 10', url: 'https://owasp.org/www-project-kubernetes-top-ten/' },
        ],
        realWorldNote: 'Most teams run Kubernetes with defaults far looser than they realize — this knowledge is in high demand precisely because it is rare.',
      },
      {
        id: 'm-devsecops',
        kind: 'mastery',
        title: 'DevSecOps & Secure SDLC',
        tagline: 'Shifting security left so it is built in, not bolted on after a scan fails.',
        objectives: [
          'Integrate SAST, DAST, and dependency scanning into a CI/CD pipeline.',
          'Design a secure code review process that developers actually tolerate.',
          'Explain how to prioritize fixes without stalling delivery.',
        ],
        topics: [
          'SAST vs. DAST vs. SCA (software composition analysis) and where each fits',
          'CI/CD pipeline security gates and how to avoid "scan fatigue"',
          'Secure code review practices and threat modeling in design reviews',
          'Vulnerability triage and risk-based prioritization for engineering teams',
        ],
        practice: [
          'Add a full security pipeline (SAST + dependency scanning) to one of your own real projects and fix every genuine finding.',
          'Threat-model a small application on paper before writing a line of code for it.',
        ],
        resources: [
          { label: 'OWASP DevSecOps Guideline', url: 'https://owasp.org/www-project-devsecops-guideline/' },
        ],
        realWorldNote: 'The hard part of this specialization is organizational, not technical — getting developers to trust and act on your findings.',
      },
    ],
  },
  {
    id: 'grc-leadership-mastery',
    title: 'Governance, Risk, Leadership & Building Programs',
    color: '#e879f9',
    summary: 'The specialization that decides whether all the technical work above ever gets funded, prioritized, or believed.',
    modules: [
      {
        id: 'm-build-program',
        kind: 'mastery',
        title: 'Building a Security Program from Scratch',
        tagline: 'What to do in the first 90 days as the only security person at an organization.',
        objectives: [
          'Prioritize a security roadmap against real budget and headcount constraints.',
          'Translate technical risk into business risk that leadership will fund.',
          'Design a minimum-viable security program for a small organization.',
        ],
        topics: [
          'Risk-based prioritization when you cannot fix everything',
          'Building buy-in: metrics and framing that resonate with non-technical leadership',
          'Choosing a framework as scaffolding (NIST CSF, CIS Controls) without over-engineering',
          'Vendor and tool selection under real budget constraints',
        ],
        practice: [
          'Write a full 90-day security program plan for a fictional 50-person company, with a real budget cap you have to respect.',
          'Present it (to a friend, mentor, or recorded video) as if pitching to a CEO who has never funded security before.',
        ],
        resources: [
          { label: 'CIS Critical Security Controls', url: 'https://www.cisecurity.org/controls' },
        ],
        realWorldNote: 'This is the role most likely to actually make an organization safer overall, precisely because it sets what everyone else works on.',
      },
      {
        id: 'm-adv-grc',
        kind: 'mastery',
        title: 'Advanced Risk Management & Compliance',
        tagline: 'Past checklist compliance into genuine risk-informed decision-making.',
        objectives: [
          'Run a quantitative or semi-quantitative risk assessment, not just a red/yellow/green heat map.',
          'Explain the actual requirements (and gaps) of major regulatory frameworks.',
          'Manage third-party/vendor risk systematically.',
        ],
        topics: [
          'Risk quantification approaches (e.g. FAIR model concepts)',
          'Audit readiness and evidence collection at scale',
          'Third-party/vendor risk management programs',
          'Regulatory deep dives relevant to your target industry (finance, healthcare, etc.)',
        ],
        practice: [
          'Take a risk register you built earlier in the core path and re-score it using a quantitative approach; compare the two rankings.',
          'Draft a vendor security questionnaire you would actually send to a real supplier.',
        ],
        resources: [
          { label: 'FAIR Institute — risk quantification', url: 'https://www.fairinstitute.org/' },
        ],
        realWorldNote: 'Regulatory depth is industry-specific — pick the regulations that match your target industry rather than trying to master all of them.',
      },
      {
        id: 'm-leadership',
        kind: 'mastery',
        title: 'Security Leadership, Communication & Reputation',
        tagline: 'The actual top of the mastery pyramid: being trusted enough that people call you first.',
        objectives: [
          'Communicate a security incident or risk clearly to a non-technical audience under pressure.',
          'Mentor someone less experienced through a real problem.',
          'Build a visible track record the community and employers can verify.',
        ],
        topics: [
          'Crisis communication during a live incident',
          'Mentoring and knowledge transfer as a skill, not an afterthought',
          'Building a public track record: write-ups, talks, open-source contributions',
          'Networking within the security community (local meetups, conferences, online communities)',
        ],
        practice: [
          'Mentor one other person through a module of the core path, purely by asking questions rather than giving answers.',
          'Give one talk (a local meetup, a Discord community, even just a recorded video) explaining something you learned in this course.',
          'Keep contributing write-ups publicly — this, more than any certificate, is what "being the first call" is actually built on.',
        ],
        resources: [
          { label: 'Local BSides conferences (worldwide, usually free or low-cost)', url: 'https://www.securitybsides.com/' },
        ],
        realWorldNote: 'Reputation is the actual credential in this field long-term — it is earned slowly, publicly, and by being right (and honest when wrong) over and over.',
      },
    ],
  },
]

export function allMasteryModules() {
  return MASTERY_TRACK.flatMap((track) =>
    track.modules.map((m) => ({ ...m, trackId: track.id, trackTitle: track.title, trackColor: track.color })),
  )
}

export function findMasteryModule(id: string) {
  return allMasteryModules().find((m) => m.id === id)
}

export const TOTAL_MASTERY_MODULES = MASTERY_TRACK.reduce((sum, t) => sum + t.modules.length, 0)

// Practices that build mastery but are ongoing habits rather than modules to "complete."
export const CONTINUOUS_PRACTICES = [
  {
    title: 'Capture the Flag (CTF) competitions',
    description: 'Rotating, time-boxed competitions covering every specialization above. The fastest feedback loop for skill-testing that exists in this field.',
    resources: [{ label: 'CTFtime — competition calendar', url: 'https://ctftime.org/' }],
  },
  {
    title: 'Bug bounty programs',
    description: 'Real applications, real scope agreements, real (if inconsistent) feedback on whether your findings actually matter.',
    resources: [{ label: 'HackerOne', url: 'https://www.hackerone.com/' }, { label: 'Bugcrowd', url: 'https://www.bugcrowd.com/' }],
  },
  {
    title: 'Conferences & local community',
    description: 'BSides events exist in most major cities and are usually free or near-free. This is where reputations and job referrals actually form.',
    resources: [{ label: 'Security BSides', url: 'https://www.securitybsides.com/' }],
  },
  {
    title: 'Teaching and mentoring',
    description: 'Explaining a concept well enough for someone else to use it is the most reliable test of whether you actually understand it.',
    resources: [],
  },
]
