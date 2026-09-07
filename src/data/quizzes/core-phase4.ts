import type { ModuleQuiz } from './types'

export const CORE_PHASE4_QUIZZES: Record<string, ModuleQuiz> = {
  w13: [
    {
      question: 'In a typical SOC tier structure, who usually performs the initial triage of incoming alerts?',
      options: ['Tier 3 analysts', 'Tier 1 analysts', 'The CISO directly', 'External auditors'],
      correctIndex: 1,
      explanation: 'Tier 1 analysts handle initial triage, deciding what is noise and what needs escalation to Tier 2 or Tier 3.',
    },
    {
      question: 'What does a SIEM primarily do that a single log file on one server cannot?',
      options: [
        'Physically secure the server room',
        'Ingest, normalize, and correlate logs from many different sources at once',
        'Automatically write all application code securely',
        'Replace the need for a firewall',
      ],
      correctIndex: 1,
      explanation: 'A SIEM aggregates and correlates events across many sources, surfacing patterns invisible from any single log file.',
    },
    {
      question: 'What is "alert fatigue," and why is it dangerous?',
      options: [
        'Analysts getting tired at the end of a shift, which is unrelated to detection quality',
        'A flood of low-value alerts causing analysts to start reflexively dismissing alerts, letting real attacks hide in the noise',
        'A SIEM running out of storage space',
        'An attacker triggering a physical alarm system',
      ],
      correctIndex: 1,
      explanation: 'Too many low-value alerts train analysts to tune them out, which can cause a real, high-value alert to be missed.',
    },
    {
      question: 'A detection rule that fires on "5 or more failed logins for the same account within one minute" is an example of what?',
      options: [
        'A firewall ACL',
        'A correlation search / detection rule translating known attacker behavior into a testable query',
        'A digital signature',
        'A DNS record',
      ],
      correctIndex: 1,
      explanation: 'This is exactly the practical skill of detection engineering: turning a known behavior pattern into a specific, testable query.',
    },
  ],
  w14: [
    {
      question: 'How does MITRE ATT&CK differ from the Cyber Kill Chain?',
      options: [
        'ATT&CK is only used by red teams, never blue teams',
        'ATT&CK breaks each Kill Chain-like stage into specific, named tactics and techniques with much finer precision',
        'They describe completely unrelated things',
        'The Kill Chain is more detailed than ATT&CK',
      ],
      correctIndex: 1,
      explanation: 'ATT&CK provides specific, named techniques and sub-techniques, giving analysts a shared, precise vocabulary beyond the Kill Chain\'s broad stages.',
    },
    {
      question: 'Why does mature detection weight TTPs more heavily than individual IOCs?',
      options: [
        'IOCs are always false positives',
        'TTPs describe how an attacker operates and change far less often than any single IP or file hash',
        'TTPs are easier to block with a firewall rule',
        'IOCs cannot be shared between organizations',
      ],
      correctIndex: 1,
      explanation: 'An attacker can trivially change an IP or hash, but changing their underlying tradecraft (TTP) is much harder and slower.',
    },
    {
      question: 'What is the purpose of using Atomic Red Team in this lesson\'s hands-on exercise?',
      options: [
        'To launch real attacks against production systems',
        'To safely simulate individual ATT&CK techniques and check whether your SIEM actually detects them',
        'To replace the need for a SIEM entirely',
        'To automatically patch vulnerabilities',
      ],
      correctIndex: 1,
      explanation: 'Atomic Red Team provides small, safe, controlled simulations of specific techniques so you can immediately validate your detection coverage.',
    },
    {
      question: 'What does an ATT&CK coverage heat map actually show?',
      options: [
        'The physical temperature of your servers',
        'Which specific techniques your defenses currently detect, partially detect, or completely miss',
        'How many employees have completed security training',
        'The geographic location of network traffic',
      ],
      correctIndex: 1,
      explanation: 'A coverage heat map turns "we have security tools" into a specific, honest answer about what would actually be caught technique by technique.',
    },
  ],
  w15: [
    {
      question: 'Why is hashing a disk image important during evidence collection?',
      options: [
        'It compresses the file to save space',
        'It creates a fingerprint that proves the image has not been altered since collection',
        'It automatically encrypts the evidence',
        'It speeds up the analysis process',
      ],
      correctIndex: 1,
      explanation: 'A cryptographic hash lets you prove at any later point that the image is bit-for-bit identical to what was originally collected.',
    },
    {
      question: 'What can memory (RAM) forensics reveal that disk forensics alone cannot?',
      options: [
        'Deleted files from months ago',
        'Processes or code injected directly into memory that may never touch disk at all',
        'The physical location of the computer',
        'The user\'s typed password history from years ago',
      ],
      correctIndex: 1,
      explanation: 'Some malicious activity exists only in volatile memory and leaves no trace on disk, which is exactly what memory forensics is built to catch.',
    },
    {
      question: 'What is the correct order of malware analysis techniques recommended in this lesson?',
      options: [
        'Dynamic analysis first, static analysis second',
        'Static analysis first (safe, no execution), then dynamic analysis (fully isolated) if needed',
        'Only static analysis is ever necessary',
        'Only dynamic analysis is ever necessary',
      ],
      correctIndex: 1,
      explanation: 'Static analysis is quick and safe and should come first; dynamic analysis (executing the sample) should only happen in a fully isolated environment.',
    },
    {
      question: 'Under what condition is it acceptable to run an unknown, "found" file for analysis, according to this lesson?',
      options: [
        'Anytime, as long as antivirus is installed',
        'Only inside a fully isolated, network-disconnected, disposable virtual machine',
        'On your main daily-use computer, briefly',
        'Never — unknown files should always be deleted immediately without analysis',
      ],
      correctIndex: 1,
      explanation: 'Full isolation (no network, disposable snapshot) is the one non-negotiable safety requirement before ever executing an unknown sample.',
    },
  ],
  w16: [
    {
      question: 'What is the correct order of the six NIST incident response lifecycle phases?',
      options: [
        'Detection, Preparation, Containment, Recovery, Eradication, Lessons Learned',
        'Preparation, Detection & Analysis, Containment, Eradication, Recovery, Lessons Learned',
        'Containment, Eradication, Preparation, Recovery, Detection & Analysis, Lessons Learned',
        'Preparation, Eradication, Detection & Analysis, Containment, Recovery, Lessons Learned',
      ],
      correctIndex: 1,
      explanation: 'The NIST lifecycle runs: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Lessons Learned, in that order.',
    },
    {
      question: 'What is a "playbook" in incident response?',
      options: [
        'A general company policy document',
        'A specific, pre-written response procedure for a known incident type, executed as a rehearsed checklist',
        'A list of all employees\' phone numbers',
        'A marketing document for clients',
      ],
      correctIndex: 1,
      explanation: 'A playbook lets the critical first minutes of a real incident be handled from a rehearsed procedure rather than improvisation under stress.',
    },
    {
      question: 'What does a tabletop exercise actually test?',
      options: [
        'It performs a real, live attack against production systems',
        'It walks a team through a simulated incident scenario verbally, testing the plan and people without touching real systems',
        'It only tests network hardware, not people or process',
        'It replaces the need for a written incident response plan',
      ],
      correctIndex: 1,
      explanation: 'A tabletop exercise is a discussion-based simulation that validates the plan and builds team readiness without any real system being affected.',
    },
    {
      question: 'Why is the "Lessons Learned" phase significant, according to this lesson?',
      options: [
        'It is legally required in all countries',
        'It is the phase most commonly skipped under time pressure, yet the one that actually prevents a repeat incident',
        'It is the first phase that should be done, before containment',
        'It only applies to phishing incidents',
      ],
      correctIndex: 1,
      explanation: 'Skipping the post-incident review is exactly how organizations end up suffering the same category of incident again.',
    },
  ],
}
