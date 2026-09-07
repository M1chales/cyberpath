import type { Challenge } from './types'

export const CORE_PHASE3_CHALLENGES: Record<string, Challenge> = {
  w09: {
    scenario:
      'You have signed, written authorization to test a small company\'s external network. Your Nmap scan of their one public IP shows: port 22 (OpenSSH 6.6.1), port 80 (redirects to 443), port 443 (a login page), and port 3389 (RDP) open to the entire internet.',
    task: 'Rank these four findings by how concerned you would be, explain your reasoning for the ranking, and name the very next thing you would actually do for the highest-priority one — within the scope of "reconnaissance and vulnerability scanning," not yet exploiting anything.',
    modelAnswer: [
      'Highest concern: RDP (3389) exposed directly to the entire internet. RDP is one of the most commonly attacked services for brute-force and known-exploit campaigns (e.g. BlueKeep), and it should almost never be directly internet-facing without a VPN in front of it.',
      'Second: OpenSSH 6.6.1 — an old version. Next action would be cross-referencing that specific version against the NVD/CVE database for known vulnerabilities before assuming it is exploitable.',
      'Third: the HTTPS login page — worth noting for the next phase (Week 10\'s web app testing) but not itself an immediate network-level red flag the way an exposed RDP port is.',
      'Lowest concern here: the HTTP-to-HTTPS redirect on port 80, which is actually good practice, not a finding.',
      'Next action for RDP specifically (within recon/scanning scope, not exploitation): document it clearly in the report as a high-priority finding, note whether a banner grab reveals the Windows version, and check whether it appears in any recent CVE advisories for that version — the recommendation itself (put it behind a VPN, or require MFA) is what goes in the report, not exploiting it in this phase.',
    ],
    stretchGoal: 'Set up an intentionally exposed RDP service in an isolated lab VM (never on a real network) and scan it yourself to see exactly what an unauthenticated scan reveals about its version and configuration.',
  },
  w10: {
    scenario:
      'While testing an authorized target, you notice the URL for viewing an invoice is `https://shop.example.com/invoice?id=8842`. Changing the number to `8843` shows you a different customer\'s invoice, including their full name and address.',
    task: 'Name the exact vulnerability class this is, explain why it happened at a technical level, and write the fix recommendation you would put in your report for the development team.',
    modelAnswer: [
      'This is an IDOR (Insecure Direct Object Reference) — specifically, Broken Access Control from the OWASP Top 10.',
      'It happens because the application checks that the requester is logged in (authentication) but never checks whether the logged-in user is actually authorized to view that specific invoice ID (authorization) — two different checks that must both be enforced.',
      'Fix recommendation: on the server side, before returning invoice data, verify that the invoice\'s owner ID matches the currently authenticated user\'s ID (or that the user has an explicit permission grant for that record) — never rely on the ID simply being "hard to guess."',
      'A stronger long-term fix: use non-sequential, non-guessable identifiers (like UUIDs) for sensitive records as defense in depth — but note in the report that this alone does NOT fix the underlying missing authorization check, it only makes guessing harder.',
      'Recommend the team audit every other endpoint that accepts a similar ID parameter, since this pattern is rarely isolated to just one endpoint once found.',
    ],
    stretchGoal: 'Find and exploit an IDOR in OWASP Juice Shop or DVWA yourself, then write the full fix recommendation as if for a real development team, including code-level guidance in whatever language the app uses.',
  },
  w11: {
    scenario:
      'In your authorized lab exploitation of Metasploitable2, you gain a shell running as the low-privilege user "www-data" — the web server\'s service account, not root.',
    task: 'Describe your actual next steps to attempt privilege escalation to root, and separately, write the specific defensive recommendation that would have prevented your initial foothold in the first place (not the privesc — the very first exploit).',
    modelAnswer: [
      'Privilege escalation next steps: enumerate the system for privesc opportunities — check for SUID binaries (find / -perm -4000), check sudo -l for any commands www-data can run as root without a password, check for writable files owned by root that a cron job might execute, and check the kernel version against known local privilege escalation exploits.',
      'A good escalation attempt tests the "easy" checks first (misconfigurations) before reaching for a kernel exploit, since kernel exploits risk crashing the system.',
      'For the defensive recommendation on the initial foothold: this depends on which specific vulnerable service was actually exploited to get the www-data shell in the first place (Metasploitable2 has several) — the correct answer names that specific service and its specific fix (e.g. "this outdated version of X has a known RCE — the fix is upgrading to a patched version, not just restricting network access").',
      'The broader point to make explicit in the write-up: the initial foothold exploit and the privilege escalation are two separate vulnerabilities requiring two separate fixes — patching one does not automatically fix the other.',
    ],
    stretchGoal: 'Complete the full chain in your lab end to end — initial foothold to root — and write it up exactly as this week\'s deliverable requires, including both defensive fixes fully named and explained.',
  },
  w12: {
    scenario:
      'You are asked to write one phishing email for an authorized internal simulation, targeting employees at a company that uses "Slack" and "Workday" for HR requests.',
    task: 'Write the actual email (subject line and body), then annotate it afterward by listing which of the four phishing tells from this week\'s lesson you deliberately included, and why a well-trained employee should still be able to catch it.',
    modelAnswer: [
      'A strong simulation email should have a subject like "Action Required: Complete Your Workday Benefits Update by Friday" — plausible, uses a real internal tool name, creates mild time pressure.',
      'Body should include: a slightly-off sending domain (workday-hr-portal.com instead of the real workday.com or company domain), a generic greeting rather than the employee\'s actual name, and a link whose visible text says "Update Now" but whose actual destination (visible on hover) goes to the mismatched domain.',
      'Annotation should explicitly call out: (1) urgency — the Friday deadline, (2) mismatched domain — workday-hr-portal.com, (3) generic greeting instead of personalization, (4) mismatched link text vs. destination.',
      'A well-trained employee should catch it specifically by hovering the link before clicking (revealing the mismatched destination) and by noticing the sending domain does not match any real company or vendor domain they recognize — the two single most reliable checks.',
      'Ethical/practical note worth stating: real simulations must be pre-approved by leadership and HR, target no specific individual maliciously, and report rate (not click rate) is the metric that should be shared back to the organization as encouragement, not shame.',
    ],
    stretchGoal: 'Load this email into GoPhish against a test environment you control and observe the actual click/report metrics it produces, then write the results summary as this week\'s deliverable requires.',
  },
}
