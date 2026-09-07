import type { ModuleQuiz } from './types'

export const CORE_PHASE2_QUIZZES: Record<string, ModuleQuiz> = {
  w05: [
    {
      question: 'What is the correct order of the TCP three-way handshake?',
      options: ['ACK, SYN, SYN-ACK', 'SYN, SYN-ACK, ACK', 'SYN-ACK, SYN, ACK', 'SYN, ACK, SYN-ACK'],
      correctIndex: 1,
      explanation: 'The client sends SYN, the server responds SYN-ACK, and the client completes the handshake with ACK.',
    },
    {
      question: 'Why does DNS typically use UDP instead of TCP for its queries?',
      options: [
        'UDP is more secure than TCP',
        'DNS cannot work over TCP at all',
        'UDP skips the handshake and retransmission overhead, which suits DNS\'s quick, simple queries',
        'UDP always encrypts traffic',
      ],
      correctIndex: 2,
      explanation: 'UDP trades reliability for speed, which is well suited to a fast, simple query like most DNS lookups.',
    },
    {
      question: 'A Wireshark filter shows many packets with the SYN flag set but no completed handshake. What does this most likely indicate?',
      options: ['Normal HTTPS browsing', 'A DNS lookup', 'A port scan or SYN flood', 'A completed file download'],
      correctIndex: 2,
      explanation: 'A high volume of SYN packets with no completed handshake is the classic signature of a scan or SYN flood.',
    },
    {
      question: 'What is the correct sequence of a browser reaching an HTTPS website, in order?',
      options: [
        'HTTP request → TCP handshake → TLS handshake',
        'TCP handshake → TLS handshake → HTTP request',
        'TLS handshake → TCP handshake → HTTP request',
        'DNS lookup → HTTP request → TCP handshake',
      ],
      correctIndex: 1,
      explanation: 'A TCP connection must be established first, then TLS negotiates encryption, and only then is the HTTP request actually sent.',
    },
  ],
  w06: [
    {
      question: 'What is the key advantage of a stateful firewall over a stateless ACL?',
      options: [
        'It is always faster',
        'It automatically allows expected return traffic for connections it already permitted',
        'It does not need any rules configured',
        'It replaces the need for encryption',
      ],
      correctIndex: 1,
      explanation: 'A stateful firewall tracks connection state, so it recognizes legitimate return traffic instead of evaluating every packet in isolation.',
    },
    {
      question: 'What is the default security posture the lesson recommends for any firewall rule set?',
      options: ['Default allow, then block known-bad traffic', 'Default deny, then explicitly allow only what is needed', 'No default — allow everything', 'Block all traffic permanently'],
      correctIndex: 1,
      explanation: 'Default-deny, allow-only-what-is-needed is the consistent principle across pfSense, iptables, and Windows Firewall.',
    },
    {
      question: 'What is the main practical difference between an IDS and an IPS?',
      options: [
        'An IDS blocks traffic automatically; an IPS only alerts',
        'An IPS sits inline and can block traffic automatically; an IDS only alerts',
        'They are functionally identical',
        'An IDS only works on encrypted traffic',
      ],
      correctIndex: 1,
      explanation: 'An IPS sits inline in the traffic path and can block matching traffic itself, while an IDS purely observes and alerts.',
    },
    {
      question: 'Why does network segmentation matter for limiting the impact of a ransomware infection?',
      options: [
        'It encrypts all network traffic automatically',
        'It prevents any device from ever being infected',
        'It contains the spread to one segment instead of the whole flat network',
        'It replaces the need for antivirus software',
      ],
      correctIndex: 2,
      explanation: 'A flat, unsegmented network lets an infection move freely; segmentation limits how far it can spread from its entry point.',
    },
  ],
  w07: [
    {
      question: 'What is the primary advantage of following a CIS Benchmark over inventing your own hardening checklist?',
      options: [
        'It requires no effort at all',
        'It only applies to cloud environments',
        'It gives specific, testable, industry-standard settings that are auditable',
        'It automatically patches every vulnerability',
      ],
      correctIndex: 2,
      explanation: 'CIS Benchmarks provide specific, testable settings rather than vague advice, making hardening work auditable and comparable across organizations.',
    },
    {
      question: 'According to this lesson, what is the single highest-return security activity in most organizations?',
      options: ['Buying more security tools', 'Patch management', 'Hiring a red team', 'Disabling all user accounts'],
      correctIndex: 1,
      explanation: 'Most real-world breaches exploit vulnerabilities that already had an available patch, making patch management extremely high-leverage.',
    },
    {
      question: 'What is the main difference between traditional antivirus and EDR?',
      options: [
        'EDR only works on Linux',
        'Antivirus mostly relies on known signatures; EDR watches behavior and can catch novel attacks',
        'Antivirus is always more effective',
        'EDR cannot be used for investigation',
      ],
      correctIndex: 1,
      explanation: 'EDR observes behavior (such as suspicious process activity) rather than relying only on matching known-bad file signatures.',
    },
    {
      question: 'Why does reducing "attack surface" (disabling unused services, closing unused ports) improve security?',
      options: [
        'It makes the system run faster only',
        'Every running service or open port is a potential entry point an attacker could use',
        'It automatically encrypts stored data',
        'It replaces the need for a firewall',
      ],
      correctIndex: 1,
      explanation: 'Anything running or listening that does not need to be is attack surface being given away for no benefit.',
    },
  ],
  w08: [
    {
      question: 'What does Kerberoasting actually abuse?',
      options: [
        'A bug in the Windows Firewall',
        'A legitimate Kerberos feature that lets any authenticated user request a service ticket encrypted with a service account\'s password hash',
        'An unpatched vulnerability in DNS',
        'A weakness in TLS certificates',
      ],
      correctIndex: 1,
      explanation: 'Kerberoasting takes a legitimate, by-design part of Kerberos and abuses it to obtain a crackable, offline copy of a service account\'s password hash.',
    },
    {
      question: 'Why should a domain administrator account never also be used to check email or browse the web?',
      options: [
        'It is against Microsoft licensing terms',
        'Everyday activity like email and browsing is exactly how credentials get phished or malware gets a foothold',
        'Administrator accounts cannot access email by design',
        'It has no real security implication',
      ],
      correctIndex: 1,
      explanation: 'Using a high-privilege account for low-security everyday tasks massively increases the chance that privileged credentials get compromised.',
    },
    {
      question: 'What does BloodHound help a defender find in their own Active Directory environment?',
      options: [
        'Open network ports',
        'Malware signatures',
        'Hidden attack paths formed by group memberships and permissions, invisible from a normal admin console',
        'Weak Wi-Fi passwords',
      ],
      correctIndex: 2,
      explanation: 'BloodHound maps AD relationships to reveal indirect attack paths — such as a low-privilege user who can reach a domain admin through several hops.',
    },
    {
      question: 'What does MFA add beyond a password to strengthen authentication?',
      options: [
        'A second password that is identical to the first',
        'A second factor such as something you have (a phone/key) or something you are (biometrics)',
        'Automatic encryption of all files',
        'A firewall rule blocking all remote logins',
      ],
      correctIndex: 1,
      explanation: 'MFA requires an additional factor beyond "something you know," so a stolen password alone is no longer sufficient to authenticate.',
    },
  ],
}
