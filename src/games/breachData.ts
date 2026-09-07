export interface TechniqueOption {
  id: string
  attackName: string
  attackFlavor: string
  defenseName: string
  defenseFlavor: string
}

export interface Stage {
  id: string
  label: string
  options: TechniqueOption[]
}

export const KILL_CHAIN_STAGES: Stage[] = [
  {
    id: 'initial-access',
    label: 'Initial Access',
    options: [
      {
        id: 'phishing',
        attackName: 'Phishing email with a malicious link',
        attackFlavor: 'An employee receives a convincing email and clicks through.',
        defenseName: 'Security awareness training + email filtering',
        defenseFlavor: 'Trained staff and filtered inboxes catch this before the click.',
      },
      {
        id: 'rdp-brute',
        attackName: 'Brute-forcing an internet-exposed RDP port',
        attackFlavor: 'RDP (3389) is open to the whole internet with a guessable password.',
        defenseName: 'VPN + MFA, no direct internet-facing RDP',
        defenseFlavor: 'RDP sits behind a VPN requiring a second factor — brute force has nothing to reach.',
      },
      {
        id: 'unpatched-cve',
        attackName: 'Exploiting a known, unpatched CVE',
        attackFlavor: 'A public-facing service is running a version with a known, published exploit.',
        defenseName: 'Patch management / vulnerability scanning',
        defenseFlavor: 'The service was patched before the exploit ever had a target.',
      },
    ],
  },
  {
    id: 'foothold',
    label: 'Foothold & Persistence',
    options: [
      {
        id: 'lotl-powershell',
        attackName: 'Office macro spawning encoded PowerShell',
        attackFlavor: 'A malicious document runs a hidden, base64-encoded PowerShell command.',
        defenseName: 'EDR rule: alert on Office apps spawning PowerShell/cmd',
        defenseFlavor: 'The parent-child process relationship is flagged and blocked immediately.',
      },
      {
        id: 'scheduled-task',
        attackName: 'Malicious scheduled task for persistence',
        attackFlavor: 'A randomly-named scheduled task is created to survive a reboot.',
        defenseName: 'Baseline monitoring of scheduled task creation',
        defenseFlavor: 'Unusual, non-standard task names outside change windows get caught fast.',
      },
      {
        id: 'web-shell',
        attackName: 'Web shell dropped via a file upload feature',
        attackFlavor: 'An unvalidated upload endpoint accepts and later executes a malicious file.',
        defenseName: 'File upload validation + WAF',
        defenseFlavor: 'The upload is rejected or the WAF blocks the shell before it can execute.',
      },
    ],
  },
  {
    id: 'privesc',
    label: 'Privilege Escalation',
    options: [
      {
        id: 'kerberoast',
        attackName: 'Kerberoasting a weak service account',
        attackFlavor: 'A service account with a crackable password hands over an offline-crackable ticket.',
        defenseName: 'Strong service account passwords + tiered admin model',
        defenseFlavor: 'The ticket is real, but the password behind it does not crack.',
      },
      {
        id: 'cred-dump',
        attackName: 'Dumping cached credentials from memory',
        attackFlavor: 'A compromised workstation has a privileged account\'s credentials cached in memory.',
        defenseName: 'No privileged logons on lower-tier hosts (PAW model)',
        defenseFlavor: 'There is nothing privileged cached here to steal in the first place.',
      },
      {
        id: 'suid-privesc',
        attackName: 'Exploiting a misconfigured SUID binary',
        attackFlavor: 'A world-executable binary with root privileges was left misconfigured.',
        defenseName: 'Regular CIS Benchmark hardening audits',
        defenseFlavor: 'The misconfiguration was already found and fixed during the last hardening pass.',
      },
    ],
  },
  {
    id: 'lateral',
    label: 'Lateral Movement',
    options: [
      {
        id: 'flat-network',
        attackName: 'Pivoting freely across a flat network',
        attackFlavor: 'One compromised host can reach every other host and server directly.',
        defenseName: 'VLAN segmentation / zero trust',
        defenseFlavor: 'The compromised host is isolated to its own segment — nowhere to pivot to.',
      },
      {
        id: 'shared-admin',
        attackName: 'Reusing a shared local admin password',
        attackFlavor: 'The same local admin password works on every workstation in the building.',
        defenseName: 'Unique local admin passwords per machine (LAPS-style)',
        defenseFlavor: 'That password only ever opened the one machine it was stolen from.',
      },
      {
        id: 'arp-spoof',
        attackName: 'ARP spoofing to intercept internal traffic',
        attackFlavor: 'A rogue device claims to be the gateway to intercept internal traffic.',
        defenseName: 'Port security / segmentation with ARP monitoring',
        defenseFlavor: 'The spoofed ARP claim is flagged and rejected at the switch.',
      },
    ],
  },
  {
    id: 'objectives',
    label: 'Actions on Objectives',
    options: [
      {
        id: 'ransomware',
        attackName: 'Ransomware encrypting shared drives',
        attackFlavor: 'Every reachable file share starts getting encrypted at once.',
        defenseName: 'Offline/immutable backups + segmentation',
        defenseFlavor: 'The encrypted shares are restored from untouched backups within hours.',
      },
      {
        id: 'dns-exfil',
        attackName: 'Exfiltrating data over DNS tunneling',
        attackFlavor: 'Stolen data is smuggled out disguised as ordinary-looking DNS queries.',
        defenseName: 'DNS monitoring / egress filtering',
        defenseFlavor: 'The abnormal DNS query pattern is flagged and the traffic is blocked.',
      },
      {
        id: 'public-bucket',
        attackName: 'Scraping data from a public storage bucket',
        attackFlavor: 'A misconfigured cloud storage bucket is openly readable by anyone.',
        defenseName: 'Least-privilege IAM + Block Public Access',
        defenseFlavor: 'The bucket was never reachable without proper credentials to begin with.',
      },
    ],
  },
]

export const ALL_DEFENSES = KILL_CHAIN_STAGES.flatMap((stage) =>
  stage.options.map((o) => ({ stageId: stage.id, stageLabel: stage.label, ...o })),
)

export const DEFENSE_BUDGET = 7
export const TOTAL_STAGES = KILL_CHAIN_STAGES.length
