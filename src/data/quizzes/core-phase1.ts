import type { ModuleQuiz } from './types'

export const CORE_PHASE1_QUIZZES: Record<string, ModuleQuiz> = {
  w01: [
    {
      question: 'What is the hexadecimal representation of the binary byte 1101 0110?',
      options: ['0xD6', '0xC5', '0xE7', '0xB4'],
      correctIndex: 0,
      explanation: 'Each hex digit maps to exactly 4 bits: 1101 = D, 0110 = 6, so the byte is 0xD6 (214 in decimal).',
    },
    {
      question: 'ARP spoofing is possible mainly because ARP operates at which layer, with no built-in authentication?',
      options: ['Layer 7 (Application)', 'Layer 4 (Transport)', 'Layer 3 (Network)', 'Layer 2 (Data Link)'],
      correctIndex: 3,
      explanation: 'ARP maps IP addresses to MAC addresses at Layer 2, and since it has no authentication, a device can falsely claim to own an IP address.',
    },
    {
      question: 'Splitting 192.168.1.0/24 into 4 equal subnets, what is the resulting subnet mask?',
      options: ['/25', '/26', '/27', '/28'],
      correctIndex: 1,
      explanation: 'Each /24 split into 4 equal parts becomes four /26 subnets (64 addresses each, 62 usable per subnet).',
    },
    {
      question: 'When you type a URL into a browser, which of these happens first?',
      options: ['The TLS handshake', 'The HTTP request is sent', 'DNS resolves the domain to an IP address', 'The TCP three-way handshake'],
      correctIndex: 2,
      explanation: 'DNS resolution has to happen first so the browser knows which IP address to even open a TCP connection to.',
    },
  ],
  w02: [
    {
      question: 'What does the command `chmod 640 secrets.conf` set the file\'s permissions to?',
      options: [
        'Owner: read/write, Group: read, Others: nothing',
        'Owner: read/write/execute, Group: read/write, Others: read',
        'Owner: read only, Group: read/write, Others: nothing',
        'Owner: read/write, Group: nothing, Others: read',
      ],
      correctIndex: 0,
      explanation: '6 = read+write (4+2) for the owner, 4 = read only for the group, 0 = no permissions for others.',
    },
    {
      question: 'Why did the lesson recommend `grep -oP` for extracting an IP from an auth log instead of `awk \'{print $11}\'`?',
      options: [
        'awk cannot process log files at all',
        'grep is always faster than awk',
        'The column position of the IP shifts depending on whether the attempted username exists, breaking fixed-column parsing',
        'awk does not support piping',
      ],
      correctIndex: 2,
      explanation: '"Failed password for invalid user X from IP" has extra words compared to "Failed password for root from IP," which shifts the IP to a different column — pattern-based extraction avoids this trap.',
    },
    {
      question: 'Which command lets a permitted user temporarily run a command with root privileges, while logging the action?',
      options: ['chown', 'sudo', 'systemctl', 'chmod'],
      correctIndex: 1,
      explanation: 'sudo elevates a permitted user temporarily and creates an audit log entry for the action.',
    },
    {
      question: 'Which tool would you use to see what processes are currently running on a Linux system?',
      options: ['grep', 'ps or top', 'chmod', 'apt'],
      correctIndex: 1,
      explanation: 'ps and top both show currently running processes; apt manages packages and chmod manages permissions.',
    },
  ],
  w03: [
    {
      question: 'In Active Directory, what is used to push a setting like a password policy to every computer in a group automatically?',
      options: ['An OU by itself', 'A Group Policy Object (GPO)', 'A Security Identifier (SID)', 'An Access Control List (ACL)'],
      correctIndex: 1,
      explanation: 'GPOs are what actually apply configuration to the users/computers organized within OUs.',
    },
    {
      question: 'What replaced NTLM as the modern default authentication protocol in Active Directory, using time-limited tickets?',
      options: ['Kerberos', 'RADIUS', 'LDAP', 'SAML'],
      correctIndex: 0,
      explanation: 'Kerberos issues time-limited tickets from a trusted authority instead of repeatedly passing credentials around the network.',
    },
    {
      question: 'What is the Windows equivalent of a Linux UID for identifying a user or computer object?',
      options: ['A GPO', 'An OU', 'A SID (Security Identifier)', 'A domain name'],
      correctIndex: 2,
      explanation: 'A SID is a unique identifier for a security principal in Windows, staying constant even if the account is renamed.',
    },
    {
      question: 'Where would you look first for a record of a failed login attempt on a Windows machine?',
      options: ['Event Viewer (Security log)', 'The registry', 'Group Policy', 'The Windows Firewall rules'],
      correctIndex: 0,
      explanation: 'Windows records login and privilege-use events in Event Viewer, primarily in the Security log.',
    },
  ],
  w04: [
    {
      question: 'A ransomware attack that encrypts files and demands payment is primarily an attack on which part of the CIA triad?',
      options: ['Confidentiality', 'Availability', 'Accountability', 'Authentication'],
      correctIndex: 1,
      explanation: 'Ransomware denies legitimate access to data — an availability failure — even though it may not read (confidentiality) the data at all.',
    },
    {
      question: 'Which threat actor category typically has the most resources and patience, often pursuing espionage rather than immediate damage?',
      options: ['Script kiddies', 'Hacktivists', 'Nation-states', 'Insiders'],
      correctIndex: 2,
      explanation: 'Nation-state actors generally have the greatest resources and are frequently focused on long-term espionage.',
    },
    {
      question: 'What is the key defensive insight behind the Cyber Kill Chain?',
      options: [
        'You must stop every single stage of an attack to succeed',
        'Breaking the chain at any one stage stops the whole intrusion',
        'The Kill Chain only applies to nation-state attackers',
        'The Kill Chain replaces the need for a SIEM',
      ],
      correctIndex: 1,
      explanation: 'Because the stages are sequential and dependent, disrupting the attacker at any single stage prevents the full intrusion from succeeding.',
    },
    {
      question: 'Compared to a single IOC, what makes MITRE ATT&CK techniques (TTPs) more valuable for long-term detection?',
      options: [
        'TTPs are easier to look up online',
        'TTPs describe attacker behavior, which changes far less often than any single indicator',
        'IOCs are always inaccurate',
        'TTPs do not require any log data to detect',
      ],
      correctIndex: 1,
      explanation: 'An IP address or file hash can change instantly; the underlying technique an attacker uses tends to persist much longer.',
    },
  ],
}
