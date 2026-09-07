export interface TerminalRound {
  id: string
  role: 'blue' | 'red'
  prompt: string
  scenario: string
  task: string
  patterns: RegExp[]
  hint: string
  exampleCommand: string
  explanation: string
}

export const TERMINAL_ROUNDS: TerminalRound[] = [
  {
    id: 'ssh-bruteforce',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'auth.log on a lab server is full of failed SSH login attempts.',
    task: 'Type a command that finds the attacking IP addresses and counts them, most frequent first.',
    patterns: [/grep/i, /failed\s*password/i, /(sort|uniq)/i],
    hint: 'Week 2: grep for the failure string, extract the IP, then sort | uniq -c | sort -rn.',
    exampleCommand: "grep 'Failed password' /var/log/auth.log | grep -oP '(?<=from )[\\d.]+' | sort | uniq -c | sort -rn",
    explanation: 'Filtering by pattern instead of a fixed column survives the "invalid user" line-length trap from Week 2.',
  },
  {
    id: 'fix-permissions',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'A file at /opt/app/secrets.conf is world-readable and contains an API key.',
    task: 'Lock it down so only the owner can read/write and the group can read — nothing for anyone else.',
    patterns: [/chmod/i, /(0?640|o-r|o=|go-w)/i],
    hint: 'Week 2: chmod 640 sets owner rw, group r, others nothing.',
    exampleCommand: 'chmod 640 /opt/app/secrets.conf',
    explanation: '640 = owner read/write (6), group read (4), others nothing (0).',
  },
  {
    id: 'nmap-version-scan',
    role: 'red',
    prompt: 'operator@kali:~$',
    scenario: 'You have written authorization to test 192.168.1.0/24. You need to know exactly what software is listening on every open port, not just which ports are open.',
    task: 'Type the Nmap command that adds service/version detection to the scan.',
    patterns: [/nmap/i, /-sv/i],
    hint: 'Week 9: -sV is the flag for service/version detection.',
    exampleCommand: 'nmap -sV 192.168.1.0/24',
    explanation: '-sV probes open ports to identify the actual software and version running behind them.',
  },
  {
    id: 'disable-service',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'A hardening pass on a Linux box finds the "cups" printing service running, though this server never prints anything.',
    task: 'Disable it immediately and prevent it from starting again on reboot.',
    patterns: [/systemctl/i, /disable/i, /cups/i],
    hint: 'Week 7: systemctl disable --now stops it now and prevents future auto-start.',
    exampleCommand: 'systemctl disable --now cups',
    explanation: 'Every unnecessary running service is attack surface being given away for free.',
  },
  {
    id: 'testssl-scan',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'You need to check your own lab web server for expired certificates, weak ciphers, or protocol downgrade issues.',
    task: 'Run the TLS scanning tool from Week 17 against your own domain.',
    patterns: [/testssl/i],
    hint: 'Week 17: testssl.sh <domain> — one word is enough here.',
    exampleCommand: 'testssl.sh your-lab-server.local',
    explanation: 'testssl.sh automatically checks for exactly this class of misconfiguration.',
  },
  {
    id: 'powershell-admins',
    role: 'blue',
    prompt: 'PS C:\\SOC>',
    scenario: 'An audit needs a list of every local administrator on a Windows workstation, exported for review.',
    task: 'Type the PowerShell command from Week 3 that lists local Administrators group members and exports them to CSV.',
    patterns: [/get-localgroupmember/i, /administrators/i],
    hint: 'Week 3: Get-LocalGroupMember -Group "Administrators" | Export-Csv ...',
    exampleCommand: 'Get-LocalGroupMember -Group "Administrators" | Export-Csv local_admins.csv -NoTypeInformation',
    explanation: 'This is exactly the audit command from Week 3\'s hands-on task, just applied here to a real question.',
  },
  {
    id: 'ping-sweep',
    role: 'red',
    prompt: 'operator@kali:~$',
    scenario: 'Before scanning individual ports, you want to quickly find which hosts on 10.0.0.0/24 are even alive.',
    task: 'Type an Nmap host-discovery scan (no port scan) across the subnet.',
    patterns: [/nmap/i, /(-sn|-sp)/i],
    hint: 'Week 9/1: -sn tells Nmap to skip port scanning and just check which hosts respond.',
    exampleCommand: 'nmap -sn 10.0.0.0/24',
    explanation: 'A host-discovery sweep is quieter and faster than a full port scan — often the very first active-recon step.',
  },
  {
    id: 'iptables-default-deny',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'A fresh Linux server needs a default-deny inbound firewall policy before it goes anywhere near a network.',
    task: 'Type the iptables command that sets the default policy on the INPUT chain to drop everything.',
    patterns: [/iptables/i, /-p\s+input/i, /drop/i],
    hint: 'Week 6: iptables -P INPUT DROP sets the default policy — you\'d follow this with explicit ACCEPT rules.',
    exampleCommand: 'iptables -P INPUT DROP',
    explanation: 'Default-deny means nothing gets in unless a later rule explicitly allows it.',
  },
  {
    id: 'tcpdump-capture',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'You need to capture traffic on interface eth0 to a file for offline analysis in Wireshark later.',
    task: 'Type the tcpdump command that captures on eth0 and writes to capture.pcap.',
    patterns: [/tcpdump/i, /-i\s*eth0/i, /-w/i],
    hint: 'Week 5: tcpdump -i <interface> -w <file>.',
    exampleCommand: 'tcpdump -i eth0 -w capture.pcap',
    explanation: 'Capturing to a file lets you analyze traffic later in Wireshark rather than only watching it live.',
  },
  {
    id: 'cloud-scan',
    role: 'blue',
    prompt: 'analyst@soc:~$',
    scenario: 'You want an automated pass over your own free-tier cloud account looking for misconfigurations like public storage or over-permissive IAM.',
    task: 'Type the name of the open-source cloud security scanner from Week 18.',
    patterns: [/prowler/i],
    hint: 'Week 18: Prowler is the tool — just running its name is enough here.',
    exampleCommand: 'prowler aws',
    explanation: 'Prowler automates exactly the kind of misconfiguration checks Week 18 walked through by hand.',
  },
]
