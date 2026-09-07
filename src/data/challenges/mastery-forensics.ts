import type { Challenge } from './types'

export const MASTERY_FORENSICS_CHALLENGES: Record<string, Challenge> = {
  'm-adv-forensics': {
    scenario:
      'Building a super-timeline for a suspected breach, you notice a critical log file\'s entries jump from 2:14am directly to 6:03am with nothing in between, while the filesystem metadata shows normal activity throughout that window.',
    task: 'Explain what this gap most likely indicates, and describe how you would attempt to fill in or corroborate what happened during it using other evidence sources.',
    modelAnswer: [
      'A clean, unexplained gap in logging with otherwise-normal filesystem activity is a classic sign of log clearing or tampering — an anti-forensic technique — rather than the system simply being idle (idle systems don\'t generate the filesystem activity you\'re seeing).',
      'Cross-reference with independent sources not easily cleared by the same actor: network device logs, any centralized/forwarded copy of the logs (if log forwarding to a separate SIEM was in place, the attacker may not have been able to clear that copy), and memory or disk artifacts with timestamps that fall in the gap.',
      'Check file system journal entries and any shadow copies/snapshots taken during that window — these can sometimes reveal file modifications that occurred even when the primary log source was cleared.',
      'Document the gap itself as a finding and an indicator of sophistication/intent — the absence of evidence is itself evidence here, and should be explicitly called out in the report rather than silently treated as "no activity."',
    ],
    stretchGoal: 'Deliberately clear a section of logs on a test system, then attempt to reconstruct what happened during the gap using only the secondary evidence sources described above.',
  },
  'm-malware-re': {
    scenario:
      'You are statically analyzing a known, publicly documented malware sample (safely, offline). The disassembly shows a function that XORs a large embedded byte array against a single-byte key before jumping to execute it.',
    task: 'Explain what this pattern most likely represents and what your next analysis step would be.',
    modelAnswer: [
      'This is a classic simple packing/obfuscation technique: the embedded byte array is very likely a second-stage payload encrypted with a trivial single-byte XOR cipher, decrypted at runtime specifically to defeat static analysis and signature-based detection.',
      'Next step: extract the byte array and the key, replicate the XOR decryption offline (in a script, not by running the sample) to reveal the actual second-stage payload without needing to execute the malware.',
      'Once decrypted, re-run static analysis (strings, disassembly) on the newly revealed payload — this is very often where the actual malicious logic (persistence, C2 configuration, exfiltration) lives, since the outer layer\'s only job was obfuscation.',
      'If static extraction proves difficult, the fallback is careful dynamic analysis in a fully isolated, network-disconnected sandbox, watching for the moment of decryption in memory — but static extraction should always be attempted first since it carries zero execution risk.',
    ],
    stretchGoal: 'Write a small script (in any language) that replicates a single-byte XOR decryption routine, and test it against a deliberately self-created "encrypted" test string to confirm your understanding of the technique before ever touching a real sample.',
  },
  'm-cloud-mobile-forensics': {
    scenario:
      'You are investigating a suspected cloud account compromise. By the time you are looped in, three days have already passed since the suspicious activity, and your organization\'s CloudTrail retention is set to the provider\'s default.',
    task: 'Explain what you are realistically at risk of having already lost, and what you would do right now, immediately, before doing any deeper analysis.',
    modelAnswer: [
      'Depending on the provider\'s default retention settings and whether advanced/extended logging was ever configured, some detailed event history from three days ago may already be at risk of aging out or may already be gone — this is a real, common problem in cloud forensics, not a hypothetical.',
      'Immediate first action, before deep analysis: export and preserve whatever logs currently exist right now to durable, separate storage — every additional hour of delay risks further loss, and preservation should happen before careful analysis, not after.',
      'Check whether any longer-term log archive already exists (e.g. logs previously exported to a storage bucket or a SIEM) that might extend visibility further back than the default in-console retention window.',
      'Once preservation is handled, proceed with analysis — but document clearly in the final report that some potential evidence may have already been unavailable by the time the investigation began, and recommend extending retention settings going forward as a direct lesson learned from this specific gap.',
    ],
    stretchGoal: 'Check your own (or a lab) cloud account\'s actual default log retention setting right now — most people are surprised how short it is compared to what they assumed.',
  },
}
