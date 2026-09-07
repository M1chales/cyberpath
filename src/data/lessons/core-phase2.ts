import type { Lesson } from './types'

export const CORE_PHASE2_LESSONS: Record<string, Lesson> = {
  w05: {
    intro:
      'You learned about TCP, ports, and the OSI model conceptually in Week 1. Now you actually watch it happen: capturing real traffic and reading it byte-by-byte is the single skill that shows up in the most later modules — network defense, threat hunting, forensics, and incident response all eventually come down to "can you read what the traffic is actually doing."',
    builtOn: ['Week 1 — How Computers & Networks Actually Work', 'Week 2 — Linux Command Line for Security Work'],
    sections: [
      {
        heading: 'TCP vs. UDP, and the three-way handshake',
        paragraphs: [
          'TCP is connection-oriented and reliable: before any data moves, the two sides perform a three-way handshake (SYN, SYN-ACK, ACK) to agree on sequence numbers, and every segment afterward is acknowledged and can be retransmitted if lost. UDP skips all of that — no handshake, no guaranteed delivery — which makes it faster and simpler, ideal for things like DNS queries or video streaming where a dropped packet is not worth the overhead of retransmission.',
          'TCP flags (SYN, ACK, FIN, RST, PSH, URG) tell you what stage a connection is in. A flood of SYN packets with no completed handshake is a classic sign of a SYN flood or a stealthy port scan — recognizing this pattern in a capture is a core skill you will use for the rest of the course.',
        ],
        code: 'Client -> Server: SYN\nServer -> Client: SYN, ACK\nClient -> Server: ACK\n[connection established, data now flows]',
        codeLabel: 'The TCP three-way handshake',
      },
      {
        heading: 'Wireshark and tcpdump',
        paragraphs: [
          'tcpdump captures traffic from the command line — useful on a remote server with no GUI, and a direct extension of the Linux fluency you built in Week 2. Wireshark does the same capture but with a graphical interface, protocol decoding, and a powerful filter language that lets you narrow millions of packets down to the handful that matter.',
        ],
        code: "tcpdump -i eth0 -w capture.pcap\n\n# In Wireshark's filter bar:\ntcp.flags.syn==1 && tcp.flags.ack==0   # SYN packets with no completed handshake\nhttp.request                          # only HTTP requests\nip.addr==192.168.1.50                 # traffic to/from one host",
        codeLabel: 'Common capture and filter commands',
      },
      {
        heading: 'HTTP, HTTPS, and the TLS handshake at a glance',
        paragraphs: [
          'Plain HTTP sends everything — including credentials, if a site is misconfigured — in cleartext, visible to anyone who can see the traffic. HTTPS wraps HTTP inside TLS, which performs its own handshake (negotiating a cipher, exchanging keys, verifying a certificate) before any HTTP data is exchanged. In a packet capture, you can watch this happen: a TCP handshake, then a TLS ClientHello/ServerHello exchange, then encrypted application data.',
        ],
        callout: {
          label: 'Connects forward',
          text: 'You will build your own certificate authority and inspect this exact handshake in far more depth in Week 17 (Cryptography & PKI).',
        },
      },
      {
        heading: 'ARP, ICMP, and Layer 2/3 attacks',
        paragraphs: [
          'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network — recall from Week 1 that this is the Layer 2/3 bridge. Because ARP has no built-in authentication, a machine can simply claim to own an IP address it does not, redirecting traffic through itself: ARP spoofing, a classic man-in-the-middle technique. ICMP (the protocol behind ping) is useful for diagnostics but also for reconnaissance — a ping sweep across a subnet is a fast way to find which hosts are alive before a more targeted scan.',
        ],
      },
      {
        heading: 'Reading a PCAP to reconstruct "what happened"',
        paragraphs: [
          'A packet capture is a timeline. The skill is not memorizing every protocol — it is asking the right sequence of questions: Who talked to whom, and when? What port and protocol? Did the handshake complete? Was there anything unencrypted worth reading? Does the volume or timing look automated rather than human? This week\'s deliverable — a written PCAP analysis report — is your first real exercise in turning raw traffic into a narrative, a skill you will repeat in almost every later defensive module.',
        ],
      },
    ],
    takeaways: [
      'TCP guarantees delivery via a handshake and acknowledgments; UDP trades reliability for speed.',
      'Wireshark and tcpdump are the same underlying skill — one visual, one scriptable — and you now need both.',
      'HTTPS is HTTP wrapped in a TLS handshake; you can watch that handshake happen in a capture.',
      'ARP has no authentication, which is exactly why ARP spoofing works as a man-in-the-middle technique.',
      'Reading a PCAP is fundamentally storytelling from timestamps, addresses, and protocol behavior.',
    ],
  },

  w06: {
    intro:
      'Now that you can read what traffic is actually doing, this week is about controlling it: firewalls, VPNs, and segmentation are the walls and checkpoints that turn "I can see the attack" into "the attack cannot reach the target in the first place."',
    builtOn: ['Week 1 — How Computers & Networks Actually Work', 'Week 5 — TCP/IP Deep Dive & Packet Analysis'],
    sections: [
      {
        heading: 'Stateful vs. stateless firewalls and ACLs',
        paragraphs: [
          'A stateless firewall (an Access Control List, or ACL) evaluates each packet in isolation against a fixed rule set — simple and fast, but it cannot tell "return traffic from a connection I allowed" apart from "a brand-new, unrelated connection." A stateful firewall tracks the state of each connection (recall the TCP handshake from Week 5) and automatically allows the expected return traffic for connections it has already permitted, which is both more secure and far less rule-writing effort.',
        ],
      },
      {
        heading: 'Configuring real firewalls: pfSense, iptables, Windows Firewall',
        paragraphs: [
          'The concept is identical everywhere — default deny, then explicitly allow only what is needed — but the implementation differs. pfSense provides a full router/firewall appliance with a web UI, iptables (and its modern replacement nftables) configures the Linux kernel\'s packet filter directly from the command line, and Windows Firewall does the same job through GUI or PowerShell on a Windows host.',
        ],
        code: '# iptables: default deny, then allow SSH and established connections\niptables -P INPUT DROP\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\niptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
        codeLabel: 'A minimal default-deny rule set',
      },
      {
        heading: 'VPNs: site-to-site vs. remote access',
        paragraphs: [
          'A VPN creates an encrypted tunnel across an untrusted network (usually the public internet). Site-to-site VPNs connect two networks permanently (e.g. two office locations); remote-access VPNs let an individual device connect into a network on demand. IPsec operates at the network layer and is common for site-to-site tunnels; SSL/TLS-based VPNs work at a higher layer and are common for remote access because they are easier to get through restrictive networks and firewalls.',
        ],
      },
      {
        heading: 'Segmentation, VLANs, and zero trust',
        paragraphs: [
          'Segmentation splits a network into isolated zones so that compromising one part does not automatically grant access to everything — the same containment principle behind the subnetting you did in Week 1, applied at a security-policy level rather than just an addressing level. VLANs implement this at the switch level, logically separating traffic even on shared physical hardware. Zero trust takes this further as a philosophy: never assume a device or user is safe just because it is "inside" the network perimeter — verify every request, every time, regardless of location.',
        ],
        callout: {
          label: 'Why this matters',
          text: 'A flat, unsegmented network is exactly why ransomware in Week 16\'s incident scenario can spread from one workstation to the entire company in minutes. Segmentation is one of the highest-leverage defenses in this entire course.',
        },
      },
      {
        heading: 'IDS vs. IPS, and an intro to Suricata/Snort',
        paragraphs: [
          'An Intrusion Detection System (IDS) watches traffic and alerts on suspicious patterns but does not block anything itself — a human or another system has to act. An Intrusion Prevention System (IPS) sits inline and can block traffic automatically the moment it matches a bad pattern. Suricata and Snort are the two dominant open-source engines for both, using a signature/rule language to describe what "suspicious" looks like — the direct ancestor of the detection rules you will write in Week 13.',
        ],
      },
    ],
    takeaways: [
      'Stateful firewalls track connections; stateless ACLs evaluate every packet blind to context.',
      'Default-deny, then explicitly allow — the same principle whether it is pfSense, iptables, or Windows Firewall.',
      'VPNs encrypt traffic across untrusted networks; site-to-site and remote-access solve different problems.',
      'Segmentation contains a breach the same way subnetting organizes a network — this is one of the highest-leverage defenses you will learn.',
      'IDS alerts; IPS blocks. Suricata/Snort rules are the direct ancestor of the SIEM detections you will write soon.',
    ],
  },

  w07: {
    intro:
      'You can now see traffic and control it at the network boundary. This week turns inward: hardening the endpoints themselves, so that even traffic you did allow through has as little to actually exploit as possible once it arrives.',
    builtOn: ['Week 2 — Linux Command Line for Security Work', 'Week 3 — Windows Internals & Active Directory Basics', 'Week 6 — Network Defense: Firewalls, VPNs & Segmentation'],
    sections: [
      {
        heading: 'CIS Benchmarks and hardening checklists',
        paragraphs: [
          'The Center for Internet Security publishes detailed, freely available hardening benchmarks for nearly every major OS, browser, and application — specific, testable settings (e.g. "disable the guest account," "require a minimum password length of 14") rather than vague advice. Following a recognized benchmark, rather than inventing your own hardening checklist, means your work is auditable and comparable to industry standard practice.',
        ],
      },
      {
        heading: 'Reducing attack surface: services, ports, accounts',
        paragraphs: [
          'Every running service, open port, and enabled account is something an attacker could potentially use — "attack surface." Using the process and package management skills from Week 2, and the equivalent Windows service management from Week 3, hardening means systematically asking "does this actually need to run?" and disabling or removing what does not.',
        ],
        code: 'systemctl list-units --type=service --state=running   # see what is actually running\nsystemctl disable --now cups.service                  # turn off a service you do not need',
      },
      {
        heading: 'Patch management and vulnerability scanning',
        paragraphs: [
          'Most real-world breaches exploit vulnerabilities that already had a patch available — patch management (systematically applying updates on a schedule) is arguably the single highest-return security activity that exists, more impactful than almost any tool. Vulnerability scanners like OpenVAS or Nessus Essentials automate the process of checking a system against a huge database of known vulnerabilities (CVEs) and reporting what is missing, ranked by severity (CVSS score).',
        ],
        callout: {
          label: 'Foreshadowing',
          text: 'In Week 9 you will use a scanner from the attacker\'s side of the table — same idea, opposite intent. Recognizing that overlap is one of the more useful realizations in this whole course.',
        },
      },
      {
        heading: 'Least privilege, service accounts, and secure defaults',
        paragraphs: [
          'A service account (an account used by an application, not a human) should have exactly the permissions it needs to run and nothing more — the same least-privilege principle from sudo (Week 2) and Windows ACLs (Week 3), applied to automated processes rather than people. "Secure by default" means a freshly installed system should already be reasonably locked down, rather than shipping wide open and relying on an admin to remember to fix it.',
        ],
      },
      {
        heading: 'Endpoint protection: antivirus vs. EDR',
        paragraphs: [
          'Traditional antivirus mostly relies on signatures — known-bad file patterns — which is fast but blind to new or disguised threats. Endpoint Detection and Response (EDR) instead watches behavior (a Word document spawning PowerShell, for instance — the exact pattern from this week\'s companion example in Week 4\'s threat-actor material) and can catch attacks that have never been seen before, while also giving defenders the ability to investigate and respond remotely.',
        ],
      },
    ],
    takeaways: [
      'CIS Benchmarks turn "harden this system" into a specific, auditable checklist rather than a vague goal.',
      'Every unnecessary running service or open account is attack surface you are giving away for free.',
      'Patch management is the highest-return security activity in this entire course — most breaches exploit known, already-patched vulnerabilities.',
      'Least privilege applies to service accounts exactly as it applies to human accounts.',
      'EDR watches behavior where traditional antivirus only watches for known signatures.',
    ],
  },

  w08: {
    intro:
      'Week 3 introduced Active Directory as the identity backbone of most organizations. Now you attack and defend it directly — because identity, not malware, is the most common real-world path an attacker actually takes from initial foothold to full compromise.',
    builtOn: ['Week 3 — Windows Internals & Active Directory Basics', 'Week 4 — Core Security Concepts & the Threat Landscape'],
    sections: [
      {
        heading: 'Why passwords alone fail, and what replaces them',
        paragraphs: [
          'A password is "something you know" — and something you know can be phished, guessed, reused across sites, or simply written down. Multi-Factor Authentication (MFA) adds "something you have" (a phone, a hardware key) or "something you are" (biometrics), so a stolen password alone is no longer enough. Single Sign-On (SSO) centralizes authentication into one trusted identity provider, which is more convenient and, if done well, more secure — but also means that identity provider becomes an extremely high-value target.',
        ],
      },
      {
        heading: 'Kerberos authentication flow — and its common abuse',
        paragraphs: [
          'Recall from Week 3 that Kerberos issues time-limited tickets instead of passing credentials around directly. Kerberoasting abuses a specific, legitimate part of this process: any authenticated user can request a service ticket for any service account, and that ticket is encrypted with a hash derived from the service account\'s password. If that password is weak, an attacker can request the ticket, take it offline, and crack it at leisure — turning a design feature into a credential-theft technique.',
        ],
      },
      {
        heading: 'Credential dumping, conceptually',
        paragraphs: [
          'Tools like Mimikatz can extract credentials (password hashes, and sometimes cached plaintext passwords or Kerberos tickets) directly from a compromised Windows machine\'s memory. You do not need to become an expert operator of these tools in the core path — the mastery-track offensive modules go deeper — but you need to understand conceptually that once an attacker has administrative access to one machine, they can often "harvest" credentials that let them move to others: lateral movement.',
        ],
      },
      {
        heading: 'Privileged Access Management and tiered admin models',
        paragraphs: [
          'A tiered administration model separates accounts by the sensitivity of what they can touch — a domain administrator account should never be the same account used to check email or browse the web, because that everyday activity is exactly how credentials get phished or malware gets a foothold. Privileged Access Management (PAM) systems enforce this separation, often issuing temporary, just-in-time elevated access rather than standing administrative rights that exist (and can be stolen) all the time.',
        ],
      },
      {
        heading: 'BloodHound: finding your own attack paths',
        paragraphs: [
          'BloodHound maps the actual relationships in an Active Directory environment — who is a member of what group, who has rights over which computer — and reveals attack paths that are invisible from a normal admin console: a low-privilege user who is, through three indirect hops, able to compromise a domain administrator. Running it against your own lab, defensively, is this week\'s central hands-on exercise, and the exact same tool professionals use both offensively (mastery-track red team work) and defensively (mastery-track threat hunting).',
        ],
      },
    ],
    takeaways: [
      'MFA and SSO exist because "something you know" alone is not a strong enough authentication factor.',
      'Kerberoasting turns a legitimate Kerberos feature into a credential-cracking opportunity when service account passwords are weak.',
      'Credential dumping tools like Mimikatz are why compromising one machine can cascade into compromising many via lateral movement.',
      'Tiered admin models and PAM keep high-privilege credentials away from everyday, phishable activity.',
      'BloodHound reveals attack paths that are invisible from a standard AD admin console — map your own before someone else does.',
    ],
  },
}
