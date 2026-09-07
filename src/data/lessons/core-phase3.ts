import type { Lesson } from './types'

export const CORE_PHASE3_LESSONS: Record<string, Lesson> = {
  w09: {
    intro:
      'Everything up to now has been defensive: understanding, hardening, controlling. Starting this week, you deliberately practice offense — not to cause harm, but because you cannot defend well against something you have never seen from the other side. Every technique here is practiced only against systems you own or are explicitly authorized to test.',
    builtOn: ['Week 4 — Core Security Concepts & the Threat Landscape', 'Week 5 — TCP/IP Deep Dive & Packet Analysis', 'Week 7 — Hardening Linux & Windows Systems'],
    sections: [
      {
        heading: 'Passive vs. active reconnaissance',
        paragraphs: [
          'This is the first, and often longest, stage of the Cyber Kill Chain you learned in Week 4. Passive reconnaissance gathers information without ever touching the target directly — public records, social media, job postings that reveal what technology a company uses, DNS records anyone can query. Active reconnaissance interacts directly with the target (scanning its ports, for instance) and is detectable and, outside authorized testing, often illegal.',
        ],
      },
      {
        heading: 'Nmap: scan types, timing, and the scripting engine',
        paragraphs: [
          'Nmap is the standard tool for active network reconnaissance. A basic scan finds which hosts are alive and which ports are open; a service/version scan (-sV) identifies what software is actually listening on those ports; the Nmap Scripting Engine (NSE) runs specialized checks (looking for specific known vulnerabilities, for example) against discovered services. Timing options control how fast and how noisy a scan is — a fast scan finishes quicker but is far easier for the IDS/IPS you studied in Week 6 to catch.',
        ],
        code: 'nmap -sV -sC -p- -T4 192.168.1.0/24\n# -sV: service/version detection  -sC: default safe scripts\n# -p-: all 65535 ports            -T4: faster timing',
        codeLabel: "This week's core Nmap sweep",
      },
      {
        heading: 'Vulnerability scanning, CVEs, and CVSS',
        paragraphs: [
          'Once you know what services are running, a vulnerability scanner (the same category of tool — OpenVAS/Nessus — you used defensively in Week 7) checks each one against a database of known, publicly disclosed vulnerabilities, each identified by a CVE number and scored for severity by CVSS (0–10). The workflow is the same whether you are the defender patching or the attacker exploiting: identify the software and version, then check what is known to be wrong with it.',
        ],
      },
      {
        heading: 'Rules of engagement and written authorization',
        paragraphs: [
          'Before any active testing against a system you do not personally own, you need explicit written authorization defining scope (exactly what is in bounds), timing, and rules of engagement (what techniques are and are not permitted). This is not a formality — it is the single line that separates "penetration tester" from "criminal," and it protects you as much as the client.',
        ],
        callout: {
          label: 'The line that matters most in this entire phase',
          text: 'Only ever scan or exploit systems you own, or a deliberately vulnerable lab VM built for this purpose, or a target where you hold explicit, written, current authorization. There is no gray area here.',
        },
      },
      {
        heading: 'The legal framework',
        paragraphs: [
          'In the United States, the Computer Fraud and Abuse Act (CFAA) makes accessing a computer system "without authorization" a federal crime, and most countries have an equivalent law. Authorization is what makes the identical technical action legal in one context and a felony in another — which is precisely why the previous section is not optional reading.',
        ],
      },
    ],
    takeaways: [
      'Passive recon never touches the target directly; active recon does, and is detectable.',
      'Nmap finds hosts and services; a vulnerability scanner then checks those services against known CVEs, scored by CVSS.',
      'Written authorization and defined scope are what make offensive testing legal at all — never skip this.',
      'The CFAA (and equivalents worldwide) make unauthorized access a crime regardless of intent.',
    ],
  },

  w10: {
    intro:
      'Reconnaissance in Week 9 usually turns up web applications — they are the most common thing an organization exposes to the internet. This week you exploit the specific, well-documented vulnerability classes that make up the OWASP Top 10, the industry-standard list of the most critical web application security risks.',
    builtOn: ['Week 5 — TCP/IP Deep Dive & Packet Analysis', 'Week 9 — Reconnaissance & Vulnerability Scanning'],
    sections: [
      {
        heading: 'Injection: SQL and command injection',
        paragraphs: [
          'Injection happens when untrusted input is concatenated directly into a command or query instead of being treated purely as data. SQL injection lets an attacker manipulate a database query — potentially reading, modifying, or deleting data far beyond what the application intended to expose. Command injection is the same idea applied to operating system commands. The fix in both cases is the same: never build a command by string-concatenating user input; use parameterized queries and strict input validation instead.',
        ],
        code: "-- Vulnerable:\nquery = \"SELECT * FROM users WHERE name = '\" + userInput + \"'\"\n-- If userInput is:  ' OR '1'='1\n-- The query becomes: SELECT * FROM users WHERE name = '' OR '1'='1'",
        codeLabel: 'Classic SQL injection pattern',
      },
      {
        heading: 'Broken authentication and session management',
        paragraphs: [
          'This covers everything from weak password policies (recall Week 8) to session tokens that never expire, are predictable, or are exposed in a URL where they can leak through browser history or referrer headers. If an attacker can steal or guess a valid session token, they do not need your password at all — they simply become you.',
        ],
      },
      {
        heading: 'Cross-Site Scripting (XSS) and CSRF',
        paragraphs: [
          'XSS happens when an application displays untrusted input back to other users without properly neutralizing it, letting an attacker run their own JavaScript in a victim\'s browser — stealing session cookies or performing actions as that user. CSRF tricks a victim\'s browser into submitting a request they never intended to make, relying on the fact that the browser will automatically attach the victim\'s existing session credentials.',
        ],
      },
      {
        heading: 'Broken access control and IDOR',
        paragraphs: [
          'Insecure Direct Object Reference (IDOR) is what happens when an application checks that you are logged in but not that you are allowed to access the specific record you asked for — changing /invoice?id=1001 to /invoice?id=1002 and simply seeing someone else\'s invoice. This is currently one of the most commonly found real-world vulnerability classes precisely because it requires no special tooling to find, only patience and a willingness to change one number in a URL.',
        ],
      },
      {
        heading: 'Burp Suite: proxy, repeater, intruder',
        paragraphs: [
          'Burp Suite sits between your browser and the target as an intercepting proxy, letting you see and modify every request before it is sent — essential for testing anything server-side, since a "disabled" button in the browser means nothing if the server does not also enforce the rule. Repeater lets you resend and tweak a single request repeatedly; Intruder automates sending many variations of a request (useful for brute-forcing a parameter or testing many payloads quickly).',
        ],
        callout: {
          label: 'Connects forward',
          text: 'Your mastery-track "Web & API Security Mastery" module goes well past this list into modern API-specific flaws like broken object-level authorization at scale — this week is the essential foundation for that later depth.',
        },
      },
    ],
    takeaways: [
      'Injection vulnerabilities come from treating untrusted input as code instead of pure data.',
      'Stealing a valid session token is often just as effective for an attacker as stealing a password.',
      'XSS attacks other users through the application; CSRF abuses a victim\'s browser and existing session.',
      'IDOR is found by changing an identifier and seeing what you should not be able to see — no special tooling required.',
      'Burp Suite matters because client-side checks are not real security controls unless the server enforces them too.',
    ],
  },

  w11: {
    intro:
      'You have now found vulnerabilities two ways: with a vulnerability scanner (Week 9) and by hand in a web app (Week 10). This week closes the loop — turning a known vulnerability into an actual working foothold on a system, so you understand exactly what "exploited" means in a breach report, and exactly why Week 7\'s patch management advice was not exaggerated.',
    builtOn: ['Week 7 — Hardening Linux & Windows Systems', 'Week 9 — Reconnaissance & Vulnerability Scanning'],
    sections: [
      {
        heading: 'Vulnerability, exploit, and payload — three different things',
        paragraphs: [
          'A vulnerability is a flaw (a CVE you found scanning in Week 9). An exploit is the specific code that takes advantage of that flaw to do something the software was never supposed to allow. A payload is what runs once the exploit succeeds — often code that opens a shell, giving the attacker command execution on the target. The Metasploit Framework organizes thousands of each into a searchable, modular library, plus auxiliary modules for scanning and encoders that try to disguise a payload from detection.',
        ],
      },
      {
        heading: 'Reverse shells vs. bind shells',
        paragraphs: [
          'A bind shell opens a listening port on the victim machine and waits for the attacker to connect to it — simple, but often blocked by a firewall protecting inbound connections (recall Week 6). A reverse shell instead has the victim machine initiate an outbound connection back to the attacker, which is far more likely to succeed because outbound traffic is typically far less restricted than inbound — a good example of why network defense has to think about traffic in both directions.',
        ],
      },
      {
        heading: 'Privilege escalation, briefly',
        paragraphs: [
          'Getting initial code execution rarely means full control — it usually lands you with the limited privileges of whatever service was exploited. Privilege escalation is the process of turning that limited foothold into administrator or root access, often by finding exactly the kind of misconfiguration — a world-writable script run by a privileged scheduled task, a service account with excess rights — that Week 2, Week 3, and Week 7 taught you to look for and lock down.',
        ],
      },
      {
        heading: 'Post-exploitation: enumeration, persistence, cleanup',
        paragraphs: [
          'Once inside, an attacker typically enumerates the environment (what else is on this network, what credentials are available — connecting directly to Week 8\'s lateral movement concepts), may establish persistence (surviving a reboot, echoing Week 1\'s boot-process discussion), and in a real attack would attempt to cover their tracks in logs. In an authorized test, this stage is about demonstrating real business impact, not causing damage — and everything is cleaned up and reported, never left behind.',
        ],
      },
      {
        heading: 'Why patch management is the highest-leverage defense against this entire module',
        paragraphs: [
          'Nearly every technique in this lesson depends on a vulnerability that already had a patch available. Every exploit you run this week, you should be able to answer one question for: "what specific patch or configuration change would have made this exploit fail?" That pairing — exploit, then defense — is exactly this week\'s deliverable, and the habit that separates a security professional from someone who just enjoys "hacking."',
        ],
      },
    ],
    takeaways: [
      'Vulnerability (the flaw), exploit (the code that abuses it), and payload (what runs after) are three distinct concepts.',
      'Reverse shells succeed more often than bind shells because outbound traffic is typically far less restricted.',
      'Privilege escalation turns a limited foothold into full control, usually via the same misconfigurations covered in Weeks 2, 3, and 7.',
      'Post-exploitation in an authorized test proves business impact — it does not cause damage or leave anything behind.',
      'Every successful exploit this week should map to a specific, known defense — usually patching.',
    ],
  },

  w12: {
    intro:
      'Every technical defense you have built so far can be bypassed by convincing a human to simply let the attacker in. This week is about the oldest and still most reliable attack vector in the field — and about building the awareness training that is itself a real security control, not an afterthought.',
    builtOn: ['Week 4 — Core Security Concepts & the Threat Landscape'],
    sections: [
      {
        heading: 'Pretexting, phishing, vishing, smishing, and baiting',
        paragraphs: [
          'These are all forms of social engineering, differing mainly in the channel and the story. Pretexting invents a plausible scenario (impersonating IT support, for instance) to extract information or access. Phishing does it by email, vishing by phone call, smishing by text message. Baiting offers something enticing (a "found" USB drive, a fake prize) to get a target to take an action that compromises them.',
        ],
      },
      {
        heading: 'The anatomy of a phishing email',
        paragraphs: [
          'The reliable tells are consistent regardless of the specific pretext: manufactured urgency ("act within 24 hours"), a mismatched or lookalike sending domain, a request that is slightly outside normal process (paying by gift card, an unusual attachment), and a link whose visible text does not match its actual destination. Teaching someone to check these four things reliably catches the overwhelming majority of real-world phishing attempts.',
        ],
        callout: {
          label: 'Practice this now',
          text: 'This week\'s related game — Phishing Spotter — runs you through ten realistic examples using exactly this checklist. If you have not played it yet, do it after finishing this lesson.',
        },
      },
      {
        heading: 'Running an authorized phishing simulation',
        paragraphs: [
          'GoPhish and similar tools let an organization send a safe, controlled phishing simulation to its own staff and measure the results — click rate (who engaged with the fake link), and more importantly, report rate (who correctly flagged it to security). Report rate is the metric that actually matters over time: it measures whether awareness training is working, not just who currently would have fallen for it.',
        ],
      },
      {
        heading: 'Physical security basics',
        paragraphs: [
          'Not every attack is digital. Tailgating (following an authorized person through a badge-locked door without your own badge) bypasses every network control instantly. A clean-desk policy and automatic device locking prevent an attacker who is physically present from simply reading sensitive information off a screen or desk. Badge cloning is a real, low-cost technique against poorly secured access cards — physical security deserves the same systematic thinking as network security, not an afterthought.',
        ],
      },
      {
        heading: 'Security awareness training as a real control, not a checkbox',
        paragraphs: [
          'The most effective awareness programs are short, frequent, and low-shame — a quick, realistic simulation and a clear, blame-free way to report a suspicious message beats an annual hour-long lecture every time. This week\'s deliverable — a one-page awareness brief you could hand to a non-technical friend or relative — is a genuine test of whether you can translate everything above into something a non-expert will actually use.',
        ],
      },
    ],
    takeaways: [
      'Social engineering techniques differ by channel (email, phone, text, in-person) but share the same psychological levers.',
      'Urgency, a mismatched domain, an unusual request, and a mismatched link are the four checks that catch most phishing.',
      'Report rate matters more than click rate — it measures whether training is actually changing behavior.',
      'Physical security (tailgating, clean desks, device locking) deserves the same rigor as network security.',
      'The best awareness training is short, frequent, and blame-free — not an annual lecture.',
    ],
  },
}
