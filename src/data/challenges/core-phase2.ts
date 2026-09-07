import type { Challenge } from './types'

export const CORE_PHASE2_CHALLENGES: Record<string, Challenge> = {
  w05: {
    scenario:
      'You are handed a PCAP and told "a coworker thinks this looks weird." Opening it, you see one internal IP sending thousands of packets to hundreds of different destination IPs on port 445, each connection lasting under a second with no completed handshake for most of them.',
    task: 'Write out what this pattern most likely is, which specific things in the capture support that conclusion, and the two Wireshark filters you\'d use to confirm it.',
    modelAnswer: [
      'This pattern strongly suggests an internal host performing a scan for the SMB service (port 445) across the network — possibly looking for vulnerable or unpatched systems, or worm-like self-propagation behavior.',
      'Supporting evidence: one source, many destinations, single port, extremely short connections, and incomplete handshakes (that "no completed handshake for most" detail is the classic scan signature from Week 5).',
      'Filter 1: `tcp.flags.syn==1 && tcp.flags.ack==0 && ip.src==<the internal IP>` to isolate the SYN-only attempts and count how many distinct destinations are being hit.',
      'Filter 2: `tcp.port==445 && ip.src==<the internal IP>` to see the full extent of the SMB-specific traffic from that host alone.',
      'Next step beyond the capture: check whether that internal host is authorized to run vulnerability scans (an IT/security tool) before treating it as an incident — the same traffic pattern is produced by both legitimate scanners and actual malware.',
    ],
    stretchGoal: 'Recreate this exact traffic pattern safely in your own lab (an internal-only Nmap scan on port 445 against your subnet) and capture it yourself to compare against a real malicious sample from malware-traffic-analysis.net.',
  },
  w06: {
    scenario:
      'A small office is moving into a new space. They want a guest Wi-Fi network for visitors, a separate network for office workstations, and a third for two internet-connected security cameras — on one router that supports VLANs.',
    task: 'Describe the segmentation design (which VLANs, what talks to what) and the firewall rule logic between them — not the exact vendor syntax, but the actual allow/deny decisions and why.',
    modelAnswer: [
      'Three VLANs: Guest, Corporate, and IoT/Cameras — each on its own subnet, with the router/firewall providing inter-VLAN routing rules rather than a single flat network.',
      'Guest VLAN: allowed outbound to the internet only, explicitly denied any access to Corporate or IoT VLANs — a compromised guest device should never be able to reach an office workstation or a camera.',
      'IoT/Camera VLAN: allowed outbound only to whatever specific service the cameras need (their cloud provider, or a local NVR on the Corporate VLAN if applicable) — denied general internet browsing and denied initiating connections into Corporate.',
      'Corporate VLAN: has the broadest access (internet, and specific access into IoT VLAN only if truly needed, e.g. to view camera feeds from a workstation) — but even here, default-deny between VLANs unless a rule explicitly allows it.',
      'This design directly follows the segmentation principle from this week: a compromised guest laptop or a compromised camera (IoT devices are notoriously weak) cannot pivot into the systems that actually matter.',
    ],
    stretchGoal: 'Actually build this in a lab with pfSense or a consumer router that supports VLANs, and verify with a scan from the Guest VLAN that Corporate and IoT are genuinely unreachable.',
  },
  w07: {
    scenario:
      'A vulnerability scan of your lab environment returns 40 findings. You have time this week to properly fix only 8 of them before a re-scan.',
    task: 'Describe the criteria you would use to pick which 8 findings to fix first, and name at least 3 categories of finding that would automatically jump to the top regardless of their raw CVSS score.',
    modelAnswer: [
      'Prioritize by a combination of severity (CVSS) AND actual exposure — an internet-facing system with a medium-severity finding often matters more than an internal-only system with a high-severity one.',
      'Prioritize findings with a known, actively exploited public exploit available over findings that are theoretical — check whether a CVE has a known exploit in the wild.',
      'Category that jumps the queue regardless of raw score: anything granting unauthenticated remote access (far more dangerous than an authenticated local issue).',
      'Category that jumps the queue: default or blank credentials on any service — trivial to exploit, embarrassingly easy to fix.',
      'Category that jumps the queue: any finding on a system holding the most sensitive data (a database server, a domain controller) — the same asset-criticality thinking from risk assessment in Week 19.',
      'Deliberately leaving low-severity, low-exposure, hard-to-exploit findings for later is a legitimate, defensible prioritization decision — not laziness — as long as it is documented.',
    ],
    stretchGoal: 'Run an actual OpenVAS or Nessus Essentials scan against your lab, produce the real findings list, and do this prioritization exercise for real instead of hypothetically.',
  },
  w08: {
    scenario:
      'You run BloodHound against your lab AD (this week\'s hands-on task) and it shows: the Helpdesk security group has "GenericAll" rights over a Tier-0 admin workstation, and that workstation has a cached credential for a Domain Admin account.',
    task: 'Explain, in plain language, exactly how an attacker would exploit this specific chain, and describe the remediation you would apply — not just "fix the permissions" but the actual tiered-admin-model fix.',
    modelAnswer: [
      'Exploitation chain: an attacker who compromises any Helpdesk account (a relatively low-value target, often reached via ordinary phishing) can use their GenericAll rights to modify the Tier-0 workstation — for example, resetting its local admin password or pushing a malicious logon script.',
      'Once they control that workstation, the cached Domain Admin credential can be harvested (echoing the credential-dumping concepts from this week\'s lesson) — turning a phished helpdesk account into full domain compromise.',
      'Remediation is not just "remove GenericAll" — the deeper fix is applying a proper tiered administration model: Domain Admins should never log into (and therefore never cache credentials on) a Tier-1 or Tier-2 workstation that a lower-privilege group like Helpdesk can touch.',
      'Practically: revoke Helpdesk\'s GenericAll rights over the Tier-0 asset, and separately enforce that Domain Admin credentials are only ever used on dedicated, tightly controlled Tier-0 systems (privileged access workstations).',
      'Re-run BloodHound after the fix to confirm the attack path is actually closed, not just that the specific permission you noticed is gone — there may be other paths to the same outcome.',
    ],
    stretchGoal: 'Build this exact scenario in your own lab (a Helpdesk group with excessive rights over an admin-adjacent object) and confirm you can actually see and then close the path in BloodHound yourself.',
  },
}
