import type { Lesson } from './types'

export const CORE_PHASE4_LESSONS: Record<string, Lesson> = {
  w13: {
    intro:
      'You have spent four weeks learning to attack. Now you switch sides for the rest of the core path: detecting exactly the kinds of activity you just practiced. A Security Operations Center is where that detection actually happens in a real organization, and a SIEM is the tool that makes it possible at scale.',
    builtOn: ['Week 5 — TCP/IP Deep Dive & Packet Analysis', 'Week 6 — Network Defense: Firewalls, VPNs & Segmentation', 'Weeks 9–12 — Offensive Security Fundamentals'],
    sections: [
      {
        heading: 'SOC tiers and the analyst workflow',
        paragraphs: [
          'A typical SOC is organized in tiers: Tier 1 analysts triage the initial flood of alerts, deciding what is noise and what needs escalation; Tier 2 investigates escalated alerts in depth; Tier 3 handles the most complex cases and often does proactive threat hunting (which you will formalize in Week 14). This is usually where a career in defensive security actually begins — and everything you have learned about networking, operating systems, and attacker behavior up to now is what makes Tier 1 triage possible instead of overwhelming.',
        ],
      },
      {
        heading: 'What a SIEM actually does',
        paragraphs: [
          'A Security Information and Event Management (SIEM) platform ingests logs from everywhere — firewalls, servers, endpoints, applications — normalizes them into a common format, and correlates events across sources to surface patterns a human staring at one log file would never catch. The failed-SSH-login pattern you grepped by hand in Week 2, and the Suricata alert you configured in Week 6, are exactly the kind of raw signal a SIEM is built to aggregate and correlate at scale.',
        ],
      },
      {
        heading: 'Splunk and the Elastic (ELK) Stack',
        paragraphs: [
          'Splunk is the dominant commercial SIEM, known for its powerful search language (SPL) and polish; the Elastic Stack (Elasticsearch, Logstash, Kibana) is the leading open-source alternative and a very reasonable free way to build real SIEM skills in your own lab. The underlying concepts — ingest, index, search, visualize, alert — transfer directly between them, so learning one genuinely teaches you the other.',
        ],
      },
      {
        heading: 'Writing detection rules and correlation searches',
        paragraphs: [
          'A detection rule expresses a specific pattern worth alerting on — "five or more failed logins for the same account within one minute," for instance, directly detecting the brute-force pattern from Week 8\'s identity module. This is the single most direct, practical skill in defensive security: translating a known attacker behavior into a precise, testable query.',
        ],
        code: 'index=auth sourcetype=ssh "Failed password"\n| stats count by src_ip, user\n| where count > 5',
        codeLabel: 'A basic brute-force detection search (Splunk-style pseudocode)',
      },
      {
        heading: 'Alert fatigue and triage prioritization',
        paragraphs: [
          'A poorly tuned SIEM generates far more alerts than any team can meaningfully investigate — and once analysts start reflexively dismissing alerts, real attacks hide in the noise. Good triage prioritizes by potential impact and confidence, and good detection engineering (the discipline you will deepen in the Mastery Track) actively works to reduce false positives rather than just generating more alerts.',
        ],
      },
    ],
    takeaways: [
      'SOC tiers escalate from initial triage (Tier 1) to deep investigation and hunting (Tier 2/3).',
      'A SIEM ingests, normalizes, and correlates logs from everywhere — the same raw signals you have been reading by hand all course.',
      'Splunk and ELK teach the same underlying skills: ingest, index, search, visualize, alert.',
      'A detection rule is a known attacker behavior translated into a precise, testable query.',
      'Alert fatigue is a real failure mode — a flood of low-value alerts is almost as dangerous as no detection at all.',
    ],
  },

  w14: {
    intro:
      'You met MITRE ATT&CK briefly in Week 4 as a vocabulary. Now you use it as a working tool: mapping real behavior to specific techniques, and proving your SIEM from last week can actually catch them.',
    builtOn: ['Week 4 — Core Security Concepts & the Threat Landscape', 'Week 13 — SOC Operations & SIEM Fundamentals'],
    sections: [
      {
        heading: 'The ATT&CK matrix in practice',
        paragraphs: [
          'Where the Kill Chain from Week 4 gives you seven broad stages, ATT&CK breaks each stage into specific, named tactics (the "why" — e.g. Persistence, Privilege Escalation) and techniques (the "how" — e.g. specific registry-key persistence methods), with sub-techniques for even finer detail. This precision is what lets an analyst say "this looks like T1110 (Brute Force)" instead of just "someone is trying a lot of passwords" — a shared, searchable vocabulary across the entire industry.',
        ],
      },
      {
        heading: 'Threat intelligence basics: IOCs, TTPs, and feeds',
        paragraphs: [
          'An Indicator of Compromise (IOC) is a specific, observable artifact — a malicious IP address, a file hash, a suspicious domain — that suggests a compromise has occurred. Tactics, Techniques, and Procedures (TTPs) describe how an attacker operates more broadly and change far less often than any single IOC, which is why mature defense weights TTP-based detection more heavily than a simple IOC blocklist. Threat intel feeds aggregate both, letting an organization prioritize detections against threats actually relevant to it.',
        ],
      },
      {
        heading: 'The detection engineering workflow',
        paragraphs: [
          'A disciplined process looks like: form a hypothesis ("if an attacker did X, what would that look like in our logs?"), identify what data source would show it, write and test a detection rule against that data, then validate it actually fires — and does not fire constantly on legitimate activity. This is a direct extension of last week\'s detection-rule writing, made rigorous and repeatable.',
        ],
      },
      {
        heading: 'Purple teaming and Atomic Red Team',
        paragraphs: [
          'Purple teaming means the offensive and defensive sides work together deliberately, rather than a red team attacking in secret and a report landing on someone\'s desk weeks later. Atomic Red Team provides small, safe, well-documented scripts that simulate individual ATT&CK techniques in a controlled way — perfect for exactly this week\'s hands-on task: simulate a technique, then check in real time whether your SIEM caught it.',
        ],
        callout: {
          label: 'This week\'s core exercise',
          text: 'Pick three ATT&CK techniques, simulate each safely with Atomic Red Team, and check your Week 13 SIEM setup against each one. Where it does not catch something, write the detection rule that would. This loop — simulate, check, fix — is the entire discipline of detection engineering in miniature.',
        },
      },
      {
        heading: 'Building an ATT&CK coverage heat map',
        paragraphs: [
          'A coverage heat map visualizes, technique by technique, whether your defenses currently detect it, partially detect it, or miss it entirely — turning "we have a SIEM" into an honest, specific answer to "what could actually get past us right now." Building and maintaining one of these is standard practice in a mature security program, and exactly what your mastery-track threat-hunting module will build on at much greater depth.',
        ],
      },
    ],
    takeaways: [
      'ATT&CK gives specific, named techniques where the Kill Chain gives broad stages — precision the industry shares as common vocabulary.',
      'TTPs are more durable signals than any single IOC, and mature detection weights them accordingly.',
      'Detection engineering is a disciplined loop: hypothesis, data source, rule, validation.',
      'Purple teaming and Atomic Red Team let you test your own detections safely and immediately, rather than waiting for a real attack to find the gaps.',
      'An ATT&CK coverage heat map turns "we have security tools" into an honest, specific answer about what you would actually catch.',
    ],
  },

  w15: {
    intro:
      'Detection tells you something is happening right now. Forensics tells you what already happened — reconstructing an intrusion after the fact from disk, memory, and the files an attacker left behind. This is where your Week 1 understanding of boot processes and filesystems, and your Week 11 understanding of what exploitation and persistence actually look like, both pay off directly.',
    builtOn: ['Week 1 — How Computers & Networks Actually Work', 'Week 2 — Linux Command Line for Security Work', 'Week 11 — Exploitation Basics & Metasploit Lab'],
    sections: [
      {
        heading: 'Chain of custody and evidence integrity',
        paragraphs: [
          'Forensic evidence is only useful if you can prove it was not altered after collection. Cryptographic hashing (recall from Week 1\'s binary/hex discussion — a hash is a fixed-size fingerprint of data) lets you prove a disk image is bit-for-bit identical to the original at any later point. A write blocker physically or logically prevents any write operation from touching original evidence during collection. A documented chain of custody records exactly who handled evidence and when, from collection through analysis.',
        ],
      },
      {
        heading: 'Disk forensics fundamentals',
        paragraphs: [
          'Tools like Autopsy (built on The Sleuth Kit) let you examine a disk image without altering it: browsing the filesystem, recovering deleted files that have not yet been overwritten, and examining metadata like file creation and modification timestamps. This directly builds on the filesystem and permissions knowledge from Week 2 — you are now reading that same structure forensically instead of administratively.',
        ],
      },
      {
        heading: 'Memory forensics with Volatility',
        paragraphs: [
          'A disk image shows you what is stored; a memory (RAM) capture shows you what was actively running at the moment of capture — including things that may never touch disk at all, like a process injected directly into another process\'s memory. Volatility is the standard open-source framework for analyzing these captures: listing running processes, network connections, and loaded modules from a snapshot of volatile memory (recall Week 1\'s distinction between volatile RAM and persistent storage).',
        ],
      },
      {
        heading: 'Static vs. dynamic malware analysis',
        paragraphs: [
          'Static analysis examines a suspicious file without running it — checking its hash against known-malware databases, extracting readable strings, examining its structure. Dynamic analysis actually executes it, but only inside a fully isolated, network-disconnected, disposable virtual machine, observing what it does in a safe environment. Static analysis is quick and safe first; dynamic analysis reveals behavior static analysis alone cannot.',
        ],
        callout: {
          label: 'Safety note',
          text: 'This week\'s hands-on task uses a known-safe sample specifically so you can practice the workflow without risk. Never run an unknown or "found" file outside a fully isolated environment — this is one of the few places in this course where a mistake has immediate real consequences.',
        },
      },
      {
        heading: 'Indicators of Compromise: finding and documenting them',
        paragraphs: [
          'Everything above — a file hash, a malicious IP from a memory-resident network connection, a suspicious registry key — is an Indicator of Compromise once you have confirmed it is actually associated with the incident. Documenting IOCs clearly (with context: where found, how confident you are, what it means) is what turns your analysis into something a SOC (Week 13) or an incident response team (Week 16) can immediately act on.',
        ],
      },
    ],
    takeaways: [
      'Hashing and write blockers prove evidence integrity; chain of custody proves who touched it and when.',
      'Disk forensics reads the same filesystem structures from Week 2, but forensically rather than administratively.',
      'Memory forensics catches what disk forensics cannot — anything that only ever existed in volatile RAM.',
      'Static analysis first, dynamic analysis (fully isolated) second — never the reverse, and never on an unknown file outside isolation.',
      'A well-documented IOC is what turns forensic analysis into something a SOC or IR team can act on immediately.',
    ],
  },

  w16: {
    intro:
      'This is the week the entire core path has been building toward. Detection (Weeks 13–14) tells you something is wrong; forensics (Week 15) tells you what happened; incident response is the structured process that turns both into an organization actually surviving a bad day intact.',
    builtOn: ['Week 13 — SOC Operations & SIEM Fundamentals', 'Week 14 — Threat Detection & MITRE ATT&CK', 'Week 15 — Digital Forensics & Malware Analysis Basics'],
    sections: [
      {
        heading: 'The NIST incident response lifecycle',
        paragraphs: [
          'NIST SP 800-61 defines the phases you will use for the rest of your security career: Preparation (before anything happens — the plan, the tools, the trained people), Detection & Analysis (recognizing and confirming an incident, using everything from Weeks 13–15), Containment (stopping the spread — often leaning directly on the segmentation from Week 6), Eradication (removing the actual cause), Recovery (safely restoring normal operation), and Lessons Learned (the step most commonly skipped, and the one that actually prevents a repeat).',
        ],
        bullets: [
          'Preparation — plan, tools, and trained people ready before anything happens',
          'Detection & Analysis — confirm it is real and scope what is affected',
          'Containment — stop it from spreading further',
          'Eradication — remove the actual cause',
          'Recovery — restore to normal, verified clean operation',
          'Lessons Learned — document and improve the plan for next time',
        ],
      },
      {
        heading: 'Classifying incidents and communicating about them',
        paragraphs: [
          'Not every incident deserves the same response — a classification scheme (by severity and by type) determines who gets notified, how fast, and by what process. Communication plans matter enormously here: internal stakeholders, legal counsel, regulators (recall the compliance context you will formalize fully in Week 19), and sometimes customers all need different information, on different timelines, often under real legal obligation.',
        ],
      },
      {
        heading: 'Runbooks and playbooks',
        paragraphs: [
          'A playbook is a specific, pre-written response procedure for a known incident type — "suspected ransomware on an endpoint," for instance — so that the first ten critical minutes of a real incident are executed from a rehearsed checklist rather than improvised under stress. This is exactly the muscle memory the Incident Response Drill game is built to train.',
        ],
      },
      {
        heading: 'Running a tabletop exercise',
        paragraphs: [
          'A tabletop exercise walks a team through a simulated incident scenario verbally, phase by phase, testing the plan and the people without any real system actually being touched. This week\'s hands-on task has you run one solo, timing yourself through each NIST phase against a ransomware scenario — the same discipline organizations use, scaled down to build the habit individually.',
        ],
      },
      {
        heading: 'Lessons learned and continuous improvement',
        paragraphs: [
          'After any real incident (or exercise), a blameless post-incident review asks what happened, what worked, what did not, and what changes to the plan or the technical environment would prevent a repeat. Skipping this step is how organizations suffer the same category of incident twice — and it is the step most commonly cut under time pressure, which is exactly why it is worth building the habit deliberately now.',
        ],
      },
    ],
    takeaways: [
      'The six NIST phases — Preparation, Detection & Analysis, Containment, Eradication, Recovery, Lessons Learned — are now your professional vocabulary for the rest of this field.',
      'Classification determines urgency and who needs to know, often under real legal and regulatory obligation.',
      'A playbook turns the first critical minutes of a real incident into a rehearsed checklist instead of improvisation.',
      'Tabletop exercises test the plan and the people without touching a real system.',
      'Lessons Learned is the step most often skipped under pressure, and the one that actually prevents a repeat.',
    ],
  },
}
