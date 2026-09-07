import type { Challenge } from './types'

export const CORE_PHASE4_CHALLENGES: Record<string, Challenge> = {
  w13: {
    scenario:
      'Your SIEM is generating 200+ alerts a day, and the Tier 1 team has started marking most of them "reviewed, no action" without real investigation. Last week, a genuine compromise sat undetected in the alert queue for three days.',
    task: 'Diagnose what went wrong here in SIEM/SOC-process terms, and describe two concrete changes you would make — one about the detections themselves, one about the triage process.',
    modelAnswer: [
      'Diagnosis: this is alert fatigue — a flood of low-value or poorly-tuned alerts trained analysts to reflexively dismiss alerts, which is exactly how the real compromise got missed in the noise.',
      'Detection-side fix: audit the existing rules for false-positive rate and either tune or retire the worst offenders — a rule that fires constantly on legitimate activity is actively harmful, not just noisy.',
      'Process-side fix: introduce a severity/confidence scoring system so genuinely high-risk alerts are visually and procedurally distinguished from routine ones, and require a documented reason (not just "reviewed, no action") for closing any alert above a certain severity.',
      'A reasonable additional step: sample a percentage of "no action" closures for a second-analyst review, specifically to catch the pattern that just caused a real miss.',
    ],
    stretchGoal: 'In your own lab SIEM, deliberately create a noisy, poorly-tuned rule, observe how it buries a genuine test alert, then tune it and confirm the signal-to-noise ratio actually improves.',
  },
  w14: {
    scenario:
      'Your EDR shows: a user opened an email attachment (a Word document), and 4 seconds later, winword.exe spawned powershell.exe with a long base64-encoded command-line argument.',
    task: 'Name the specific MITRE ATT&CK technique(s) this maps to, and describe the detection rule you would write to catch this pattern in the future — specific enough to actually implement, not just "detect suspicious PowerShell."',
    modelAnswer: [
      'This maps to a Phishing-delivered malicious attachment (Initial Access) leading to a Command and Scripting Interpreter technique — specifically PowerShell (T1059.001) — being spawned via a suspicious parent-child process relationship.',
      'The base64-encoded command line is itself a notable indicator, often associated with obfuscation to evade simple string-based detection (T1027, Obfuscated Files or Information).',
      'A specific, implementable detection: alert whenever winword.exe, excel.exe, or outlook.exe appears as the parent process of powershell.exe or cmd.exe — this parent-child relationship is rarely legitimate and is a very high-fidelity signal.',
      'Sharpen it further: specifically flag when the PowerShell command line contains -enc or -EncodedCommand, since legitimate business use of encoded PowerShell commands is rare.',
      'State the expected false-positive risk honestly: some legitimate mail-merge or document-automation macros could theoretically trigger this, so the rule should be tested against real environment activity before being set to auto-block rather than just alert.',
    ],
    stretchGoal: 'Simulate this exact technique safely with Atomic Red Team in your lab and confirm your SIEM/EDR setup actually catches the parent-child relationship you just designed a rule for.',
  },
  w15: {
    scenario:
      'You are called in after a suspected breach. A laptop is still powered on and logged in. Someone on-site already unplugged it from the network "to be safe" and is asking whether they should shut it down and image the hard drive next.',
    task: 'Explain what was done right, what was done wrong, and the correct next 3 steps in order — referencing chain of custody and the disk-vs-memory distinction from this week.',
    modelAnswer: [
      'Unplugging from the network was reasonable containment (stopping further spread or exfiltration) but disconnecting network access to a still-running machine can also disrupt certain investigative options — worth noting, though not necessarily wrong here.',
      'What was wrong, or at least premature: shutting the machine down would be a serious mistake at this point — it would wipe volatile memory, destroying any evidence of running malicious processes, injected code, or network connections that only exist in RAM.',
      'Correct step 1: capture memory first, while the machine is still running, using a proper memory acquisition tool — before anything else touches the machine.',
      'Correct step 2: only after memory is captured, image the disk using a write blocker, hashing the resulting image immediately to establish integrity.',
      'Correct step 3: document every action taken so far (including the well-intentioned network disconnection) with timestamps and who performed it — chain of custody starts from the very first person who touched the machine, not from when a forensic examiner arrives.',
    ],
    stretchGoal: 'Practice this exact sequence in your lab: capture memory from a running VM with Volatility-compatible tooling, then image the disk, and write a chain-of-custody log as if this were a real case.',
  },
  w16: {
    scenario:
      'It is 7:45am. Your monitoring shows three file servers with files renamed to a strange extension and a ransom note dropped in each directory. More machines are showing early signs (encrypted file activity just starting) as you watch.',
    task: 'Walk through your actual first 30 minutes using the NIST IR lifecycle — name the specific actions you take in the first phase you\'re actually in, not a general description of all six phases.',
    modelAnswer: [
      'You are already past Preparation and into Detection & Analysis/Containment simultaneously — this is confirmed, active ransomware, not a suspected incident requiring further analysis first.',
      'Immediate containment action: isolate the actively-encrypting machines from the network first (network segmentation or disabling network interfaces) — the highest priority is stopping the spread to the machines not yet affected, before deep analysis of the already-hit servers.',
      'Simultaneously, activate the incident response plan\'s communication tree — notify the predetermined incident commander and stakeholders per the plan, rather than improvising who needs to know.',
      'Do NOT reboot or shut down affected machines yet if memory forensics may be needed later (echoing Week 15) — but do NOT delay containment of unaffected machines to preserve this evidence; the priority order is stop the spread, then preserve evidence on what\'s already hit.',
      'Within the first 30 minutes, you should NOT yet be focused on eradication, recovery, or root cause — those come after containment is confirmed to actually be holding.',
    ],
    stretchGoal: 'Run this exact scenario as a timed, solo tabletop exercise (as this week\'s hands-on task requires) and see how close your actual response time and decisions come to this model answer.',
  },
}
