export interface QuizRound {
  id: string
  prompt: string
  detail: string
  correct: 0 | 1
  explanation: string
}

export const PHISHING_ROUNDS: QuizRound[] = [
  {
    id: 'p1',
    prompt: 'From: IT-Support@paypa1-security.com — Subject: Urgent: Your account will be suspended in 24 hours',
    detail:
      '"We detected unusual activity. Click here to verify your identity immediately or your account will be permanently locked: http://paypa1-secure-login.com/verify"',
    correct: 1,
    explanation:
      'The domain "paypa1-security.com" uses a "1" instead of "l" — a classic lookalike domain. Urgency + a mismatched link are the two biggest phishing tells.',
  },
  {
    id: 'p2',
    prompt: 'From: notifications@github.com — Subject: [GitHub] New sign-in to your account',
    detail:
      '"We noticed a new sign-in to your account from Chrome on macOS. If this was you, no action is needed. If not, please secure your account: https://github.com/settings/security"',
    correct: 0,
    explanation:
      'The domain matches exactly, the link points to the real settings page, there is no urgency pressure, and it explicitly says "no action needed" if it was you — consistent with genuine security notifications.',
  },
  {
    id: 'p3',
    prompt: 'From: ceo.office@yourcompany-hr.co — Subject: Quick favor before my meeting',
    detail:
      '"Hi, I\'m stuck in a board meeting and need you to buy 5 gift cards for a client gift ASAP. Send me the codes once purchased. Don\'t call, I can\'t take calls right now. — sent from my iPhone"',
    correct: 1,
    explanation:
      'A classic "CEO fraud" / business email compromise pattern: urgency, an unusual request (gift cards), a reason to avoid verifying by phone, and a lookalike domain ("-hr.co" instead of the real company domain).',
  },
  {
    id: 'p4',
    prompt: 'From: billing@spotify.com — Subject: Your receipt from Spotify',
    detail:
      '"Thanks for your Spotify Premium payment of $10.99. Your next billing date is the 14th. View your invoice in your account settings at spotify.com."',
    correct: 0,
    explanation:
      'Correct domain, no urgent call to action, no request for credentials, and it points you to the real site to check rather than an embedded "verify now" link.',
  },
  {
    id: 'p5',
    prompt: 'From: security-alert@micros0ft-support.com — Subject: Critical Security Alert: Action Required',
    detail:
      '"Microsoft has detected malware on your device. Call our support line immediately at the number below or download our removal tool: [download link]"',
    correct: 1,
    explanation:
      'A zero ("0") instead of "o" in the domain, a scare-tactic subject line, and a request to download a file or call an unverified number — a classic tech-support scam pattern.',
  },
  {
    id: 'p6',
    prompt: 'From: hr@yourcompany.com — Subject: Reminder: benefits open enrollment closes Friday',
    detail:
      '"This is a reminder that open enrollment closes this Friday at 5pm. Log in to the benefits portal through the usual company intranet link to make any changes."',
    correct: 0,
    explanation:
      'Correct internal domain, references an existing known process (open enrollment), and tells you to use the "usual" link rather than providing a new one to click — consistent with a genuine internal reminder.',
  },
  {
    id: 'p7',
    prompt: 'From: delivery@usps-tracking-update.com — Subject: Your package could not be delivered',
    detail:
      '"We attempted to deliver your package but a $2.99 redelivery fee is required. Pay now to reschedule: [pay link]. Failure to pay within 48 hours will result in the package being returned to sender."',
    correct: 1,
    explanation:
      'USPS does not charge redelivery fees via email links, the domain is not usps.com, and there is an artificial countdown — all classic parcel-delivery scam tells.',
  },
  {
    id: 'p8',
    prompt: 'From: no-reply@accounts.google.com — Subject: Security alert',
    detail:
      '"A new device signed in to your Google Account. If this wasn\'t you, we recommend you review your recently used devices at myaccount.google.com immediately."',
    correct: 0,
    explanation:
      'Legitimate Google domain, directs you to type in the known real URL yourself rather than click an embedded link, and does not ask for your password directly in the email.',
  },
  {
    id: 'p9',
    prompt: 'From: winner-notification@international-lottery-claims.net — Subject: CONGRATULATIONS! You have won $1,000,000',
    detail:
      '"You have been selected as a winner in our international email lottery. To claim your prize, reply with your full name, address, date of birth, and a processing fee of $150."',
    correct: 1,
    explanation:
      'Advance-fee lottery scam: you did not enter a lottery you don\'t remember, and legitimate prizes never require you to pay money upfront or send personal identity details by email.',
  },
  {
    id: 'p10',
    prompt: 'From: no-reply@slack.com — Subject: You have unread messages in #engineering',
    detail:
      '"You have 3 unread messages in the #engineering channel. Open Slack to catch up: [open in Slack button linking to yourteam.slack.com]"',
    correct: 0,
    explanation:
      'Matches the real sender domain, links to your specific known team subdomain rather than a generic or lookalike URL, and doesn\'t request any credentials or urgent action.',
  },
]

export const PACKET_ROUNDS: QuizRound[] = [
  {
    id: 'n1',
    prompt: 'Firewall log: one external IP hits 40 different ports on your server within 3 seconds',
    detail: 'Source: 203.0.113.44 → Destination: your-server (ports 21, 22, 23, 25, 80, 443, 3306, 3389, ...40 total)',
    correct: 1,
    explanation:
      'A single source hitting dozens of ports in seconds is a textbook port scan — reconnaissance ahead of a potential attack, not normal user traffic.',
  },
  {
    id: 'n2',
    prompt: 'Traffic log: your laptop connects to 172.217.x.x on port 443 while you have Gmail open',
    detail: 'Steady, low-volume encrypted traffic over TLS to a known Google IP range, consistent with a browser tab open in the background.',
    correct: 0,
    explanation:
      'Port 443 (HTTPS) to a known Google IP range while Gmail is open is exactly what normal webmail traffic looks like.',
  },
  {
    id: 'n3',
    prompt: 'Auth log: 200 failed SSH login attempts for user "root" from the same IP within 2 minutes',
    detail: 'sshd[1234]: Failed password for root from 198.51.100.7 port 51422 ssh2 (repeated 200 times, different passwords each time)',
    correct: 1,
    explanation:
      'A rapid burst of failed logins for a privileged account with different passwords each time is a brute-force / credential-stuffing attack signature.',
  },
  {
    id: 'n4',
    prompt: 'DNS log: a workstation resolves "a8f2c91b7e4d.example-cdn-assets.com" every 60 seconds, sending small TXT queries',
    detail: 'Repeating queries to a randomized-looking subdomain, small but constant TXT record lookups, no corresponding web browsing activity.',
    correct: 1,
    explanation:
      'Randomized-looking subdomains with regular TXT record beaconing is a common pattern for DNS tunneling — used to exfiltrate data or maintain covert command-and-control.',
  },
  {
    id: 'n5',
    prompt: 'ARP table: two different MAC addresses both claim to be the network gateway IP within the same minute',
    detail: '192.168.1.1 is aa:bb:cc:00:11:22, then moments later 192.168.1.1 is reported as 66:77:88:99:00:11 on the same subnet.',
    correct: 1,
    explanation:
      'A gateway IP suddenly mapping to a second MAC address is the signature of ARP spoofing — an attacker trying to intercept traffic via a man-in-the-middle position.',
  },
  {
    id: 'n6',
    prompt: 'Web server log: a user loads /products, then /products/42, then /cart, then /checkout, in order, over 3 minutes',
    detail: 'Sequential, human-paced page loads from a single session cookie matching a normal shopping flow.',
    correct: 0,
    explanation:
      'A sequential, human-paced browsing flow through a normal shopping funnel is exactly what legitimate customer traffic looks like.',
  },
  {
    id: 'n7',
    prompt: 'Outbound traffic log: a database server (which normally only talks to your app servers) suddenly sends 4GB to an unfamiliar external IP at 3am',
    detail: 'Sustained high-volume outbound transfer, off-hours, from a server with no legitimate reason to talk to the public internet.',
    correct: 1,
    explanation:
      'A backend database server pushing a large volume of data to an unfamiliar external destination, especially off-hours, is a strong indicator of data exfiltration.',
  },
  {
    id: 'n8',
    prompt: 'VPN log: an employee\'s account logs in from your city at 9:01am and from a country they have never visited at 9:03am',
    detail: 'Two successful logins for the same account, 2 minutes apart, from physically impossible locations given normal travel time.',
    correct: 1,
    explanation:
      'This is called "impossible travel" — two logins too far apart geographically to both be genuine in that time window strongly suggests a compromised credential being used from two places.',
  },
  {
    id: 'n9',
    prompt: 'Printer traffic: an office printer sends and receives normal print-job traffic on port 631 (IPP) to workstations on the same subnet',
    detail: 'Small, bursty traffic matching print job sizes, only between known internal devices on the same local network.',
    correct: 0,
    explanation:
      'Standard printing protocol traffic between known internal devices on the same subnet is routine office network activity.',
  },
  {
    id: 'n10',
    prompt: 'Endpoint log: a user\'s laptop spawns PowerShell from Microsoft Word moments after opening an email attachment',
    detail: 'WINWORD.EXE → powershell.exe -enc <long base64 string>, occurring seconds after the attachment was opened.',
    correct: 1,
    explanation:
      'Office applications spawning PowerShell with an encoded command is a well-known "living off the land" pattern for malicious macro payloads — a strong indicator of a malware infection chain in progress.',
  },
]

export interface PortPair {
  port: string
  service: string
}

export const PORT_PAIRS: PortPair[] = [
  { port: '20/21', service: 'FTP (data/control)' },
  { port: '22', service: 'SSH' },
  { port: '23', service: 'Telnet' },
  { port: '25', service: 'SMTP' },
  { port: '53', service: 'DNS' },
  { port: '80', service: 'HTTP' },
  { port: '110', service: 'POP3' },
  { port: '143', service: 'IMAP' },
  { port: '443', service: 'HTTPS' },
  { port: '445', service: 'SMB' },
  { port: '3306', service: 'MySQL' },
  { port: '3389', service: 'RDP' },
]

export interface IRScenario {
  id: string
  title: string
  description: string
}

export const IR_SCENARIOS: IRScenario[] = [
  {
    id: 's1',
    title: 'Ransomware note on 3 workstations',
    description:
      'It\'s 9:03am. Three employees report their desktop wallpaper changed to a ransom note and their files now have a strange extension.',
  },
  {
    id: 's2',
    title: 'Compromised executive email account',
    description:
      'The CFO\'s email account just sent 40 emails with a malicious invoice link to external partners, but the CFO says they never sent them.',
  },
  {
    id: 's3',
    title: 'Unusual outbound traffic from the database server',
    description:
      'Your SIEM flags the production database server sending several gigabytes of traffic to an unfamiliar IP address overnight.',
  },
]

export const IR_PHASES = [
  { id: 'prep', label: 'Preparation', hint: 'Have the plan, tools, and trained people ready before anything happens.' },
  { id: 'detect', label: 'Detection & Analysis', hint: 'Confirm it is real, scope what is affected, and classify severity.' },
  { id: 'contain', label: 'Containment', hint: 'Stop it from spreading further — isolate affected systems.' },
  { id: 'eradicate', label: 'Eradication', hint: 'Remove the actual cause — malware, backdoor, compromised account.' },
  { id: 'recover', label: 'Recovery', hint: 'Restore systems to normal operation, verified clean.' },
  { id: 'lessons', label: 'Lessons Learned', hint: 'Document what happened and improve the plan for next time.' },
]
