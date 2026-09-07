import type { Lesson } from './types'

export const MASTERY_FORENSICS_LESSONS: Record<string, Lesson> = {
  'm-adv-forensics': {
    intro:
      'Week 15 taught you to examine one disk image or one memory capture in isolation. Real investigations need to correlate several evidence sources into a single defensible timeline — and to survive an opposing party trying to poke holes in exactly that timeline.',
    builtOn: ['Week 15 — Digital Forensics & Malware Analysis Basics'],
    sections: [
      {
        heading: 'Super-timelines',
        paragraphs: [
          'A super-timeline (built with tools like Plaso/log2timeline) merges timestamps from many different sources — filesystem metadata, browser history, event logs, registry changes — into one chronologically sorted view, revealing an attacker\'s full dwell time and activity in a way no single source could show alone. This is the natural extension of the "reconstruct what happened" instinct you built reading a single PCAP in Week 5 and a single disk image in Week 15.',
        ],
      },
      {
        heading: 'Filesystem-level artifacts',
        paragraphs: [
          'Modern filesystems keep far more history than most people realize: journaling logs recent changes for crash recovery (and forensic reconstruction), and shadow copies (Windows) or snapshots can preserve earlier versions of files an attacker thought they deleted. Recovering "deleted" data, as introduced in Week 15, often means finding it in one of these secondary structures rather than the primary filesystem.',
        ],
      },
      {
        heading: 'Anti-forensic techniques',
        paragraphs: [
          'A sophisticated attacker may attempt timestomping (altering file timestamps to blend in with legitimate activity), clearing event logs, or wiping specific files. Each of these techniques leaves its own trace — a log that was cleared shows a suspicious gap, and timestomping can be detected by comparing multiple independent timestamp sources that do not agree with each other.',
        ],
        callout: {
          label: 'Practice exercise',
          text: 'Deliberately timestomp a file on a test system, then try to detect your own tampering using artifact analysis alone. Doing this once makes anti-forensic detection concrete in a way reading about it never will.',
        },
      },
      {
        heading: 'Legal defensibility',
        paragraphs: [
          'Technically correct analysis is not enough if it cannot survive cross-examination — chain of custody (Week 15) has to be airtight, methodology has to be reproducible by another examiner, and conclusions have to be stated at the appropriate confidence level (echoing the structured, honest confidence language from the threat-intelligence mastery module). This is a distinct skill from the technical analysis itself, and worth deliberately studying through real, publicly documented case law.',
        ],
      },
    ],
    takeaways: [
      'A super-timeline correlates multiple evidence sources into one chronological narrative no single source provides alone.',
      'Journaling and shadow copies often hold "deleted" data that never actually left the disk.',
      'Anti-forensic techniques (timestomping, log clearing) leave their own detectable traces.',
      'Legal defensibility — chain of custody, reproducibility, honest confidence — is a distinct skill from the technical analysis itself.',
    ],
  },

  'm-malware-re': {
    intro:
      'Week 15 had you perform safe static analysis (hashes, strings) on a known-safe sample. Malware reverse engineering goes to the next level of depth: actually reading the assembly instructions to understand precisely what a piece of malware does, rather than trusting a sandbox report\'s summary of it.',
    builtOn: ['Week 15 — Digital Forensics & Malware Analysis Basics'],
    sections: [
      {
        heading: 'Assembly fundamentals',
        paragraphs: [
          'x86/x64 assembly is the low-level instruction set a CPU actually executes — recall the fetch-decode-execute cycle from Week 1. Reading it well enough to follow control flow and recognize common patterns (a loop, a function call, a comparison and jump) is the core technical skill this module builds, typically through a disassembler that turns raw binary back into readable assembly.',
        ],
      },
      {
        heading: 'Static tooling: disassemblers and decompilers',
        paragraphs: [
          'A disassembler shows you the raw assembly instructions; a decompiler attempts to reconstruct something closer to the original higher-level source code, which is faster to read but less precise. Professional analysis usually moves between both, using the decompiler for a quick overview and dropping into the disassembler for the exact detail that matters.',
        ],
      },
      {
        heading: 'Dynamic analysis, sandboxing, and packing',
        paragraphs: [
          'Dynamic analysis (introduced safely in Week 15) becomes far more central here: running a sample in a fully isolated, snapshotted, network-disconnected VM and observing its actual behavior — file writes, registry changes, network connection attempts. Many real malware samples are packed or obfuscated specifically to defeat static analysis, so recognizing common packing signatures and knowing basic unpacking approaches is a practical necessity, not an advanced curiosity.',
        ],
        callout: {
          label: 'Safety note — repeated deliberately',
          text: 'Never run an untrusted or "found" sample outside a fully isolated, network-disconnected, disposable environment. Only work from known, publicly documented samples sourced specifically for authorized research. This is the one area of the entire course where a lab mistake has real consequences.',
        },
      },
      {
        heading: 'Identifying persistence, C2, and exfiltration logic',
        paragraphs: [
          'The actual goal of a malware analysis report is answering specific, actionable questions: how does this sample survive a reboot (connecting back to Week 1\'s boot sequence and Week 11\'s persistence concepts)? What command-and-control infrastructure does it call out to? What data is it trying to steal, and how? A report structured around these questions, with a MITRE ATT&CK mapping, is directly usable by a SOC or IR team the same day.',
        ],
      },
    ],
    takeaways: [
      'Reading assembly well enough to follow control flow is the core skill — disassemblers and decompilers are complementary tools for it.',
      'Packing and obfuscation are specifically designed to defeat static analysis, making dynamic analysis in full isolation essential.',
      'A useful malware report answers specific questions: persistence, C2, and exfiltration — mapped to ATT&CK for immediate use.',
      'This is the one part of the entire course where a lab safety mistake has genuine real-world consequences — isolation is not optional.',
    ],
  },

  'm-cloud-mobile-forensics': {
    intro:
      'Week 18 introduced cloud logging as the cloud equivalent of the OS logs from Weeks 3 and 13. This module treats that logging as primary forensic evidence in its own right — because in cloud and mobile environments, a traditional disk image is often unavailable, incomplete, or gone within hours.',
    builtOn: ['Week 15 — Digital Forensics & Malware Analysis Basics', 'Week 18 — Cloud Security Fundamentals'],
    sections: [
      {
        heading: 'Cloud audit logs as primary evidence',
        paragraphs: [
          'Recall from Week 18 that services like AWS CloudTrail or Microsoft 365 audit logs record essentially every API call against an account. In a cloud investigation, these logs are frequently the entire evidence base — there may be no disk to image at all if the compromised resource was a serverless function or a container that no longer exists.',
        ],
      },
      {
        heading: 'Ephemeral infrastructure',
        paragraphs: [
          'A cloud instance, container, or serverless function can be created and destroyed in seconds, and default log retention windows are often shorter than an organization realizes until they need evidence that has already expired. Knowing what to preserve immediately, before it rotates out of retention, is frequently more valuable in cloud forensics than deep analytical skill applied too late.',
        ],
      },
      {
        heading: 'Mobile forensics fundamentals',
        paragraphs: [
          'Mobile devices add their own complications: a logical acquisition extracts accessible data through the OS\'s normal APIs, while a physical acquisition attempts to image the raw storage directly — often blocked or significantly complicated by device encryption enabled by default on modern phones, which did not exist as a default obstacle on the disk images from Week 15.',
        ],
      },
      {
        heading: 'Jurisdictional complexity',
        paragraphs: [
          'Cloud data can legally reside across multiple countries simultaneously, each with different laws about law enforcement access and data sovereignty, and mobile evidence often has to satisfy the legal standards of more than one jurisdiction when an incident crosses borders — a genuinely different legal landscape from the single-jurisdiction disk image scenarios in the core path.',
        ],
      },
    ],
    takeaways: [
      'Cloud audit logs are often the entire evidence base — there may be no traditional disk to image at all.',
      'Retention windows expire fast; knowing what to preserve immediately often matters more than deep analysis skill.',
      'Mobile encryption-by-default makes physical acquisition far harder than the Week 15 disk-imaging scenarios.',
      'Cross-jurisdiction legal complexity is a real, distinct challenge in cloud and mobile investigations.',
    ],
  },
}
