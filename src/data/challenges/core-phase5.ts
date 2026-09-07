import type { Challenge } from './types'

export const CORE_PHASE5_CHALLENGES: Record<string, Challenge> = {
  w17: {
    scenario:
      'A testssl.sh scan of a company\'s website returns three findings: the certificate expired 4 days ago, the server still accepts TLS 1.0 connections, and the server supports one weak cipher suite alongside several strong ones.',
    task: 'Rank these three findings by urgency and explain your reasoning, then explain in plain terms (as if to the non-technical site owner) why the expired certificate is not "just a formality."',
    modelAnswer: [
      'Most urgent: the expired certificate. Browsers will show every visitor a hard security warning, actively driving users away or training them to click through certificate warnings (a dangerous habit) — this has immediate, visible business impact today.',
      'Second: continued support for TLS 1.0 — a deprecated protocol with known weaknesses, and often a compliance failure (e.g. PCI-DSS explicitly disallows it) even if no active exploitation is happening yet.',
      'Third (lowest of the three, but still worth fixing): the single weak cipher suite, since the server still offers strong ciphers as an alternative — a real client will typically negotiate the strong option, though a downgrade attack against a misconfigured client remains theoretically possible.',
      'Plain-language explanation for the site owner: a certificate proves to a visitor\'s browser that they are really talking to your website and not an imposter — once it expires, the browser cannot make that promise anymore, so it warns the visitor loudly, exactly like a bank suddenly being unable to verify a signature on a check.',
    ],
    stretchGoal: 'Deliberately let a certificate expire on your own lab web server, observe exactly what each major browser shows a visitor, and then renew it and confirm the warning disappears.',
  },
  w18: {
    scenario:
      'A junior developer on your team just asked in Slack: "hey is it ok if I make this S3 bucket public so our contractor can grab the export file without me having to set up their AWS access?"',
    task: 'Write your actual Slack reply — technically correct, but written for a developer, not a security lecture — and then describe the secure alternative you would set up instead.',
    modelAnswer: [
      'A good reply directly says no and briefly why, in developer-relevant terms: "Please don\'t — a public bucket means literally anyone on the internet who finds or guesses the URL can access every file in it, and these get scanned/found within hours in practice, not hypothetically."',
      'It should acknowledge the actual underlying need (giving the contractor access) rather than just shutting the request down, to avoid the developer finding a worse workaround later.',
      'Secure alternative: generate a pre-signed URL for that specific file with a short expiration (e.g. 24 hours) — the contractor gets exactly the file they need, with no standing access and no bucket-wide exposure.',
      'Longer-term alternative if this is a recurring need: create a scoped IAM user or role for the contractor with least-privilege access to only the specific prefix/folder they need, following the least-privilege principle from this week.',
      'Good practice to mention: recommend the team enable "Block Public Access" at the account level so this mistake becomes structurally harder to make again, not just personally corrected this one time.',
    ],
    stretchGoal: 'Set up this exact scenario in a free-tier AWS account — a bucket, a pre-signed URL, and a scoped IAM policy — and verify each actually behaves as expected.',
  },
  w19: {
    scenario:
      'During a risk assessment, you learn that the only person who knows how to restore backups if the primary sysadmin is unavailable is that same sysadmin — no one else has ever practiced or documented the restore process.',
    task: 'Write this as a proper risk register entry (the actual fields: risk description, likelihood, impact, and a recommended mitigation) and separately state which NIST CSF function this mitigation would fall under.',
    modelAnswer: [
      'Risk description: "Backup restoration is a single-person-dependent process with no documentation or cross-training, creating a risk of extended recovery time or complete recovery failure if that individual is unavailable during an incident."',
      'Likelihood: Medium (people go on vacation, get sick, or leave jobs — this is not a rare edge case) — Impact: High (this directly undermines the Recovery phase of incident response for every other risk on the register).',
      'Recommended mitigation: document the restore procedure in detail, and have at least one other team member successfully perform a full test restore, not just read the documentation.',
      'This is a classic case where the risk is not really about backups technically failing — it is an organizational/process risk, which risk registers should capture just as rigorously as technical ones.',
      'NIST CSF function: this mitigation falls primarily under Recover (ensuring resilience and restoration capabilities), though the initial identification of the risk itself falls under Identify.',
    ],
    stretchGoal: 'Actually write a one-page backup-restore runbook for your own lab environment, then hand it to someone else (a friend, or just yourself a week later with no memory aids) and see if they can follow it successfully.',
  },
  w20: {
    scenario:
      'You are applying for a junior SOC analyst role. The job posting specifically mentions "experience with SIEM tools, log analysis, and incident response" — and you have this course\'s labs but no paid work experience.',
    task: 'Write the actual resume bullet points (2-3) you would use to describe your course work for this specific posting, and write out how you would answer the interview question "walk me through a time you investigated a security incident" using your Week 20 capstone.',
    modelAnswer: [
      'Strong resume bullets are specific and quantified, not generic: "Built and operated a home-lab SOC using Splunk/ELK, writing detection rules that identified simulated brute-force and living-off-the-land attack techniques mapped to MITRE ATT&CK" beats "Learned about SIEM tools."',
      'Second bullet example: "Conducted a full incident response exercise — attack, detection, forensic analysis, and remediation — for a self-designed ransomware scenario, producing a complete incident report and after-action review."',
      'For the interview answer, structure it like a real incident narrative using your actual capstone: what was detected and how, what your initial triage/analysis showed, what containment/eradication steps you took, and what you learned or would do differently — this is literally the NIST lifecycle from Week 16, narrated as your own experience.',
      'Critically, be honest that this was a self-directed lab exercise, not a live production incident — interviewers respect this distinction and specificity far more than vague implied claims of "real" experience; the depth and correctness of your process is what actually impresses a technical interviewer.',
    ],
    stretchGoal: 'Actually record yourself answering this interview question out loud, timed to 2 minutes, and listen back critically — most people are surprised how much they ramble the first time.',
  },
}
