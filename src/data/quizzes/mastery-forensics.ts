import type { ModuleQuiz } from './types'

export const MASTERY_FORENSICS_QUIZZES: Record<string, ModuleQuiz> = {
  'm-adv-forensics': [
    {
      question: 'What does a "super-timeline" accomplish that a single evidence source cannot?',
      options: [
        'It encrypts all evidence automatically',
        'It merges timestamps from many sources (filesystem, browser, logs) into one chronological narrative',
        'It replaces the need for chain of custody',
        'It only works on mobile devices',
      ],
      correctIndex: 1,
      explanation: 'Correlating multiple evidence sources into one timeline reveals full attacker dwell time and activity that no single source shows alone.',
    },
    {
      question: 'Where might "deleted" data actually still be recoverable, according to this module?',
      options: [
        'Nowhere — deleted data is always unrecoverable',
        'In secondary structures like filesystem journals or shadow copies/snapshots',
        'Only in the CPU cache',
        'Only if the file was never opened',
      ],
      correctIndex: 1,
      explanation: 'Journaling and shadow copies often preserve earlier versions or traces of files an attacker believed were fully deleted.',
    },
    {
      question: 'How can timestomping (falsifying file timestamps) often be detected?',
      options: [
        'It cannot be detected under any circumstances',
        'By comparing multiple independent timestamp sources that fail to agree with each other',
        'By checking the file\'s color in a file browser',
        'By running antivirus software',
      ],
      correctIndex: 1,
      explanation: 'Inconsistent timestamps across different independent sources reveal that one of them has likely been artificially altered.',
    },
    {
      question: 'What is described as a distinct skill from the technical forensic analysis itself?',
      options: [
        'Installing forensic software',
        'Legal defensibility — presenting findings that hold up to cross-examination',
        'Taking screenshots',
        'Naming evidence files consistently',
      ],
      correctIndex: 1,
      explanation: 'Legal defensibility (chain of custody, reproducibility, honest confidence) requires its own deliberate study, separate from technical skill.',
    },
  ],
  'm-malware-re': [
    {
      question: 'What is the main difference between a disassembler and a decompiler?',
      options: [
        'They are the same tool with different names',
        'A disassembler shows raw assembly instructions; a decompiler reconstructs something closer to higher-level source code',
        'A decompiler only works on Windows',
        'A disassembler can only analyze network traffic',
      ],
      correctIndex: 1,
      explanation: 'A decompiler is faster to read but less precise; a disassembler is exact but requires reading assembly directly.',
    },
    {
      question: 'Why are many real malware samples packed or obfuscated?',
      options: [
        'To make the file smaller for storage reasons only',
        'Specifically to defeat static analysis',
        'Because antivirus requires it',
        'To comply with software licensing',
      ],
      correctIndex: 1,
      explanation: 'Packing and obfuscation are deliberately used to prevent static analysis from revealing the sample\'s true behavior.',
    },
    {
      question: 'What is the required environment for dynamic malware analysis, according to this module?',
      options: [
        'Any spare laptop connected to the internet',
        'A fully isolated, snapshotted, network-disconnected, disposable virtual machine',
        'A production server during off-hours',
        'A virtual machine with internet access for accurate results',
      ],
      correctIndex: 1,
      explanation: 'Full isolation is the one non-negotiable requirement — this is the area of the entire course where a mistake has real consequences.',
    },
    {
      question: 'What should a useful malware analysis report be structured around, according to this module?',
      options: [
        'Only the file size and creation date',
        'Persistence mechanism, C2 infrastructure, exfiltration logic, and a MITRE ATT&CK mapping',
        'The programming language the analyst prefers',
        'A list of every string found in the binary with no analysis',
      ],
      correctIndex: 1,
      explanation: 'A report built around these specific, actionable questions is directly usable by a SOC or IR team the same day.',
    },
  ],
  'm-cloud-mobile-forensics': [
    {
      question: 'Why might a cloud investigation have no traditional disk image to examine at all?',
      options: [
        'Cloud providers refuse all forensic requests',
        'A compromised resource may have been a serverless function or container that no longer exists',
        'Disk images are illegal to collect from the cloud',
        'Cloud disks cannot be hashed',
      ],
      correctIndex: 1,
      explanation: 'Ephemeral cloud resources can be destroyed within minutes, leaving audit logs as the primary or only evidence.',
    },
    {
      question: 'What is often more valuable in cloud forensics than deep analytical skill applied later?',
      options: [
        'Knowing what to preserve immediately, before retention windows expire',
        'Having the most expensive forensic software',
        'Waiting for the cloud provider to investigate on your behalf',
        'Analyzing only the most recent 24 hours of activity',
      ],
      correctIndex: 0,
      explanation: 'Cloud log retention windows are often shorter than expected — preserving evidence immediately can matter more than analytical depth applied too late.',
    },
    {
      question: 'What makes physical acquisition significantly harder in mobile forensics compared to the disk imaging from the core path?',
      options: [
        'Phones have no persistent storage',
        'Device encryption enabled by default on modern phones',
        'Mobile devices cannot be powered off',
        'There is no such thing as physical acquisition for mobile devices',
      ],
      correctIndex: 1,
      explanation: 'Default encryption on modern mobile devices is a major obstacle that did not exist as a default in the Week 15 disk-imaging scenarios.',
    },
    {
      question: 'What additional legal complexity does cloud evidence introduce compared to a single on-premises disk image?',
      options: [
        'None — the legal process is identical',
        'Cloud data can legally reside across multiple countries with different laws on access and data sovereignty',
        'Cloud evidence is never admissible in any court',
        'Cloud evidence does not require chain of custody',
      ],
      correctIndex: 1,
      explanation: 'Cross-jurisdiction legal complexity is a genuinely distinct challenge that a single-country, single-disk scenario does not raise.',
    },
  ],
}
