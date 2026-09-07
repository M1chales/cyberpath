import type { ModuleQuiz } from './types'

export const CORE_PHASE3_QUIZZES: Record<string, ModuleQuiz> = {
  w09: [
    {
      question: 'What is the key difference between passive and active reconnaissance?',
      options: [
        'Passive recon is illegal; active recon is always legal',
        'Passive recon never directly touches the target; active recon interacts with it directly and is detectable',
        'They are the same thing',
        'Active recon only works against web applications',
      ],
      correctIndex: 1,
      explanation: 'Passive recon relies on public information without touching the target; active recon (like scanning) interacts directly and can be detected.',
    },
    {
      question: 'In an Nmap command, what does the `-sV` flag do?',
      options: ['Scans all 65,535 ports', 'Detects service and version information on open ports', 'Runs the fastest possible timing template', 'Performs a stealth SYN scan only'],
      correctIndex: 1,
      explanation: '-sV specifically attempts to identify what software and version is running behind each open port.',
    },
    {
      question: 'What does a CVSS score represent?',
      options: [
        'The exact financial cost of a breach',
        'How many known exploits exist for a vulnerability',
        'A standardized severity rating for a vulnerability, from 0 to 10',
        'The number of systems affected by a vulnerability',
      ],
      correctIndex: 2,
      explanation: 'CVSS (Common Vulnerability Scoring System) rates the severity of a vulnerability on a 0–10 scale.',
    },
    {
      question: 'What single document is required before performing any active testing against a system you do not personally own?',
      options: [
        'A résumé',
        'Explicit written authorization defining scope and rules of engagement',
        'A verbal agreement is always sufficient',
        'Nothing — testing is legal as long as no damage occurs',
      ],
      correctIndex: 1,
      explanation: 'Written authorization and defined scope are what make offensive testing legal at all, and protect the tester as much as the client.',
    },
  ],
  w10: [
    {
      question: 'What makes SQL injection possible in the vulnerable code pattern shown in this lesson?',
      options: [
        'The database itself is inherently insecure',
        'User input is concatenated directly into a query instead of being treated as pure data',
        'The web server is using HTTPS',
        'The application does not use a firewall',
      ],
      correctIndex: 1,
      explanation: 'Concatenating untrusted input directly into a query lets an attacker change the query\'s logic — the fix is parameterized queries.',
    },
    {
      question: 'What is the key difference between XSS and CSRF?',
      options: [
        'They are two names for the same attack',
        'XSS runs attacker script in a victim\'s browser; CSRF tricks a victim\'s browser into making an unintended request using their existing session',
        'CSRF only affects mobile apps',
        'XSS requires physical access to the server',
      ],
      correctIndex: 1,
      explanation: 'XSS injects and runs malicious script for other users to encounter; CSRF abuses a victim\'s already-authenticated browser session.',
    },
    {
      question: 'What is an IDOR vulnerability, in simple terms?',
      options: [
        'A server that does not use TLS',
        'The application checks you are logged in, but not whether you are allowed to access the specific record you requested',
        'A denial-of-service caused by too many simultaneous logins',
        'A misconfigured DNS record',
      ],
      correctIndex: 1,
      explanation: 'IDOR happens when authentication is checked but authorization for the specific resource is not — often found just by changing an ID in a URL.',
    },
    {
      question: 'Why does the lesson emphasize testing with Burp Suite rather than trusting the browser alone?',
      options: [
        'Browsers cannot send HTTP requests',
        'A client-side check (like a disabled button) means nothing if the server does not also enforce the rule',
        'Burp Suite is required to view HTML source',
        'Burp Suite automatically fixes vulnerabilities',
      ],
      correctIndex: 1,
      explanation: 'Intercepting and modifying requests before they reach the server reveals whether the server enforces rules that the client-side UI merely suggests.',
    },
  ],
  w11: [
    {
      question: 'What is the correct relationship between a vulnerability, an exploit, and a payload?',
      options: [
        'They are all the same thing',
        'A vulnerability is the flaw, an exploit is the code that abuses it, and a payload is what runs after the exploit succeeds',
        'A payload is the flaw, and an exploit is the fix for it',
        'A vulnerability only exists after an exploit is written',
      ],
      correctIndex: 1,
      explanation: 'These are three distinct concepts: the flaw itself, the code that takes advantage of it, and what actually executes once it works.',
    },
    {
      question: 'Why does a reverse shell typically succeed more often than a bind shell?',
      options: [
        'Reverse shells are always encrypted',
        'Outbound connections are typically far less restricted by firewalls than inbound connections',
        'Bind shells do not work on Linux',
        'Reverse shells do not require any network connection',
      ],
      correctIndex: 1,
      explanation: 'A reverse shell has the victim initiate an outbound connection, which is generally allowed more freely than unsolicited inbound connections.',
    },
    {
      question: 'What is privilege escalation?',
      options: [
        'Gaining any code execution on a target for the first time',
        'Turning a limited initial foothold into administrator or root-level access',
        'Encrypting a target\'s files for ransom',
        'Scanning a network for open ports',
      ],
      correctIndex: 1,
      explanation: 'Privilege escalation takes a limited foothold (from the initial exploit) and elevates it to much broader control over the system.',
    },
    {
      question: 'According to this lesson, what question should you be able to answer after every successful exploit in an authorized test?',
      options: [
        'How much the exploit tool costs',
        'What specific patch or configuration change would have made the exploit fail',
        'How many other testers have used the same exploit',
        'Whether the exploit works on Windows XP',
      ],
      correctIndex: 1,
      explanation: 'Pairing every exploit with its defense is what turns offensive practice into genuinely useful security skill.',
    },
  ],
  w12: [
    {
      question: 'What is the difference between phishing, vishing, and smishing?',
      options: [
        'They are unrelated attack categories with nothing in common',
        'They are the same technique delivered by email, phone call, and text message respectively',
        'Smishing only targets smartphones running a specific OS',
        'Vishing requires physical access to the victim',
      ],
      correctIndex: 1,
      explanation: 'All three are social engineering; they differ mainly in the delivery channel (email, voice call, text).',
    },
    {
      question: 'Which metric does the lesson say matters more over time in a phishing simulation program?',
      options: ['Click rate', 'Report rate', 'How many emails were sent', 'How expensive the simulation tool was'],
      correctIndex: 1,
      explanation: 'Report rate measures whether people are actually internalizing training and taking the correct action, not just who currently would fall for it.',
    },
    {
      question: 'What is "tailgating" in a physical security context?',
      options: [
        'Sending too many phishing emails at once',
        'Following an authorized person through a badge-locked door without using your own badge',
        'A type of malware that spreads through USB drives',
        'Intercepting network traffic on a shared Wi-Fi network',
      ],
      correctIndex: 1,
      explanation: 'Tailgating bypasses every digital access control by exploiting simple physical proximity and social norms around holding doors open.',
    },
    {
      question: 'What four tells does the lesson highlight for reliably spotting phishing emails?',
      options: [
        'Font size, email length, time of day sent, number of attachments',
        'Manufactured urgency, a mismatched sending domain, an unusual request, and a mismatched link destination',
        'Whether the email uses color, whether it has images, whether it is signed, and its file size',
        'The sender\'s name, subject line length, number of recipients, and time zone',
      ],
      correctIndex: 1,
      explanation: 'These four checks reliably catch the overwhelming majority of real-world phishing attempts, regardless of the specific pretext used.',
    },
  ],
}
