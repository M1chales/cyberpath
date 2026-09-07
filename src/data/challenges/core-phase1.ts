import type { Challenge } from './types'

export const CORE_PHASE1_CHALLENGES: Record<string, Challenge> = {
  w01: {
    scenario:
      'A relative calls you: their new smart camera connects to the app but shows "offline" and never actually streams video. They\'ve restarted it twice and are ready to return it.',
    task: 'Write out, step by step, exactly how you would diagnose this over the phone — using the DHCP → DNS → TCP/ports model from this week, not guesswork. Name what you\'d check at each step and what result would tell you where the problem actually is.',
    modelAnswer: [
      'Confirm the camera actually got an IP address from DHCP — check the router\'s connected-devices list for the camera\'s presence and IP.',
      'If it has an IP, check whether it can resolve DNS — many smart devices phone home to a cloud service; a DNS failure would explain "connected to Wi-Fi but offline in the app."',
      'Check whether the relevant outbound port is being blocked — some ISP routers or "kids mode" firewalls block non-standard ports the camera\'s cloud service uses.',
      'Rule out a Wi-Fi band issue — many cheap IoT devices only support 2.4GHz, not 5GHz; if the router broadcasts one SSID for both bands, the camera may be joining the wrong one.',
      'If DHCP, DNS, and port access all check out, the problem is on the vendor\'s cloud side, not the local network — a genuinely different category of fix than anything on this end.',
    ],
    stretchGoal: 'Actually set this up in your lab: put a device on an isolated VLAN and block outbound DNS, then watch what "offline" actually looks like from the device\'s perspective in a packet capture.',
  },
  w02: {
    scenario:
      'You\'ve been handed SSH access to a Linux box with a 400MB auth.log and told: "we think someone\'s been trying to brute-force this box, and there\'s a config file with a leaked API key that has the wrong permissions somewhere in /opt/app."',
    task: 'Write the actual commands (not descriptions) you would run to (1) find the top 5 IPs by failed login attempts, and (2) find any file under /opt/app that is world-readable or world-writable.',
    modelAnswer: [
      'grep \'Failed password\' /var/log/auth.log | grep -oP \'(?<=from )[\\d.]+\' | sort | uniq -c | sort -rn | head -5',
      'find /opt/app -type f -perm -o+r -o -perm -o+w',
      'For the permissions fix, once found: chmod o-rw <file> (or the specific correct permission, not just "lock it down" without a plan for what breaks).',
      'Bonus correctness check: confirm the fix didn\'t break the application by checking which user/group the app actually runs as (ps aux | grep app, or check the systemd unit\'s User= line) before changing ownership blindly.',
    ],
    stretchGoal: 'Write this as an actual Bash script that takes a log path as an argument and outputs both findings — reusable, not one-off.',
  },
  w03: {
    scenario:
      'Your manager says: "We just had a security audit, and it found that we have no idea who has local administrator rights across our 50 Windows workstations. Also, HR wants a new intern\'s account created by Friday, restricted to only the Marketing shared drive."',
    task: 'Describe your approach to both problems using this week\'s AD/PowerShell concepts — specifically what you would run and where in AD structure the new account would go.',
    modelAnswer: [
      'For the admin audit: use PowerShell remoting to run Get-LocalGroupMember -Group "Administrators" against all 50 machines (via a loop over a computer list or Invoke-Command with -ComputerName), exporting combined results to one CSV for review.',
      'Flag any account showing up as a local admin that should not be (personal accounts, old contractor accounts, or accounts that are also domain admins — a red flag for privilege sprawl).',
      'For the new account: create the user in an appropriate OU (e.g. an "Interns" or "Marketing" OU, not a generic default Users container) so it inherits the right GPOs automatically.',
      'Grant access to the Marketing shared drive via group membership (add to a "Marketing-ReadWrite" security group that already has the correct NTFS/share permissions) rather than assigning permissions to the individual account directly — much easier to revoke later.',
      'Set the account to expire or be reviewed at the internship\'s end date rather than relying on someone remembering to disable it manually.',
    ],
    stretchGoal: 'Actually build this in your lab AD: create the OU, the security group, the intern account, and verify with Get-LocalGroupMember or a permissions check that access is exactly as intended — no more, no less.',
  },
  w04: {
    scenario:
      'In an elevator, your company\'s CEO asks you: "Be honest — are we going to get hacked?" You have about 30 seconds before the doors open.',
    task: 'Write the actual 30-second answer you would give, using the CIA triad and threat-actor framing from this week to make it substantive rather than a shrug. Then separately, pick one real, publicly reported breach and map it to the 7 Kill Chain stages in one line each.',
    modelAnswer: [
      'A strong elevator answer names a specific, realistic threat (e.g. "our most likely risk is a phishing email getting someone\'s password, not a nation-state attack") rather than a vague reassurance or vague fear.',
      'It should mention what is actually being done about the most likely risk, briefly and confidently, showing this has been thought through rather than improvised.',
      'It should NOT promise "we are 100% safe" (dishonest and undermines credibility later) or induce panic with worst-case scenarios that are not actually the most probable risk.',
      'Kill Chain mapping of a real breach: Reconnaissance (attacker researched target), Weaponization (built/acquired the exploit or phishing kit), Delivery (sent the phishing email or exploited a public-facing service), Exploitation (the vulnerability or human error triggered), Installation (malware or backdoor persisted), Command & Control (attacker maintained remote access), Actions on Objectives (data stolen, ransomware deployed, etc.).',
    ],
    stretchGoal: 'Do this same exercise with two more real breaches from different industries, and compare which Kill Chain stage each organization\'s existing defenses actually failed at — a pattern often repeats.',
  },
}
