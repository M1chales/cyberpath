import type { Lesson } from './types'

export const CORE_PHASE1_LESSONS: Record<string, Lesson> = {
  w01: {
    intro:
      'Everything else in this course — packet capture, exploitation, incident response — assumes you already have a working mental model of how a computer and a network actually move data around. This week builds that model from the ground up so nothing later feels like magic.',
    sections: [
      {
        heading: 'Binary, hex, and why computers count differently than you do',
        paragraphs: [
          'A computer stores everything — text, images, this sentence — as bits: electrical states that are either 0 or 1. Group 8 bits together and you get a byte, the basic unit you will see everywhere (file sizes, memory addresses, network packets).',
          'Hexadecimal (base 16) exists purely for human convenience: each hex digit represents exactly 4 bits, so a full byte is always exactly 2 hex digits. That is why you will see MAC addresses, memory addresses, and hash values written in hex — it is a compact, exact way to write binary without a 8-character string of 0s and 1s.',
        ],
        code: 'Binary:  1101 0110\nHex:     D    6      -> 0xD6\nDecimal: 214',
        codeLabel: 'The same byte, three ways',
      },
      {
        heading: 'Inside the box: CPU, RAM, storage, and the boot process',
        paragraphs: [
          'The CPU repeatedly fetches an instruction, decodes it, and executes it — billions of times a second. RAM holds whatever the CPU is actively working with, but it is volatile: cut the power and it is gone. Storage (an SSD or HDD) is slower but persistent, which is why your files survive a reboot and your open browser tabs do not.',
          'When you power on a machine, firmware (BIOS or UEFI) runs first, does a hardware check, then hands control to a bootloader, which loads the operating system kernel into RAM. The kernel then starts background services (Linux calls this "init") until you get a login screen.',
        ],
        callout: {
          label: 'Why this matters for security',
          text: 'Malware that wants to survive a reboot has to insert itself somewhere in this chain — a startup service, a scheduled task, a registry key that runs at boot. You will use this exact boot sequence when you look for persistence mechanisms in Week 15 (forensics) and Week 7 (hardening).',
        },
      },
      {
        heading: 'The OSI model and the TCP/IP model: two maps of the same territory',
        paragraphs: [
          'The 7-layer OSI model (Physical, Data Link, Network, Transport, Session, Presentation, Application) is the classic teaching model. In practice, the internet runs on the simpler 4-layer TCP/IP model (Network Access, Internet, Transport, Application), which just groups several OSI layers together.',
          'The reason security people care about layers at all: different attacks and different tools operate at different layers. ARP spoofing is a Layer 2 attack, IP spoofing is Layer 3, a SYN flood targets Layer 4, and SQL injection or XSS happen at Layer 7. Knowing the layer tells you which tool and which defense actually applies.',
        ],
        bullets: [
          'Layer 2 (Data Link): MAC addresses, switches, ARP',
          'Layer 3 (Network): IP addresses, routers, routing',
          'Layer 4 (Transport): TCP/UDP, ports, the handshake',
          'Layer 7 (Application): HTTP, DNS, SMTP — where most web attacks live',
        ],
      },
      {
        heading: 'IP addressing, subnetting, and MAC addresses',
        paragraphs: [
          'Every device on a network gets an IP address (e.g. 192.168.1.15) and a subnet mask (e.g. 255.255.255.0, written as /24) that together define which addresses are "local" versus which need to go through a router. Subnetting is the practice of splitting one network into smaller ones — useful for organizing a network and, security-wise, for containing an attacker to one segment instead of the whole building.',
          'A MAC address (e.g. 00:1A:2B:3C:4D:5E) is a hardware identifier burned into a network interface, used for Layer 2 delivery on the local network. IP addresses can change; MAC addresses (mostly) do not, which is exactly why ARP — the protocol that maps IP to MAC — becomes a target, as you will see in Week 5.',
        ],
        code: '192.168.1.0/24 split into 4 subnets of 62 usable hosts each:\n192.168.1.0/26   (.1  - .62)\n192.168.1.64/26  (.65 - .126)\n192.168.1.128/26 (.129 - .190)\n192.168.1.192/26 (.193 - .254)',
        codeLabel: 'Worked subnetting example (this week\'s hands-on task)',
      },
      {
        heading: 'DNS, DHCP, and what actually happens when you type a URL',
        paragraphs: [
          'When your laptop joins a network, DHCP hands it an IP address, a subnet mask, a default gateway, and a DNS server — automatically, so you never have to configure it by hand. When you then type a URL, your machine asks its DNS server to translate the human-readable name into an IP address, walking from a root server to the right top-level-domain server to the site\'s own authoritative server if it is not already cached.',
          'Once your browser has the IP address, it opens a TCP connection to it (the three-way handshake you will study properly in Week 5), negotiates TLS encryption, and finally sends an HTTP request. The response comes back the same way in reverse. Every step here is a separate thing that can be misconfigured, intercepted, or spoofed — which is most of what the rest of this course is about.',
        ],
      },
      {
        heading: 'Ports, sockets, and the protocols you will live in',
        paragraphs: [
          'A port is just a number (0–65535) that identifies which application on a machine a piece of traffic is meant for. An IP address plus a port is called a socket, and it is how a server can run a web service on port 80 and an SSH service on port 22 at the same time, on the same machine, without the traffic getting confused.',
          'A short list of ports you need to simply know cold by the end of this week: 22 (SSH), 21 (FTP), 25 (SMTP), 53 (DNS), 80 (HTTP), 443 (HTTPS). You will drill these against their protocol names in this week\'s Port & Protocol Match game — treat that as a fluency check, not busywork.',
        ],
      },
    ],
    takeaways: [
      'Everything a computer stores is binary; hex is just a compact, human-friendly way to write it.',
      'The boot process (firmware → bootloader → kernel → services) is also the map of where persistence mechanisms hide.',
      'OSI/TCP-IP layers tell you which tool and which attack apply at which point in the stack.',
      'Subnetting divides one network into smaller, containable segments.',
      'A URL request is DHCP, then DNS, then TCP handshake, then TLS, then HTTP — five separate steps, five separate places things can go wrong.',
    ],
  },

  w02: {
    intro:
      'Week 1 gave you the map of how a computer and network work. This week you get your hands on the actual controls: the Linux command line, which is where you will do almost all of your work for the rest of this course, from Wireshark analysis to writing detection rules.',
    builtOn: ['Week 1 — How Computers & Networks Actually Work'],
    sections: [
      {
        heading: 'The filesystem, permissions, and ownership',
        paragraphs: [
          'Linux organizes everything as a single tree starting at / (root), unlike Windows\' separate drive letters. Every file and directory has an owner, a group, and a set of permissions (read, write, execute) for the owner, the group, and everyone else — shown as something like -rwxr-xr--.',
          'chmod changes permissions and chown changes ownership. Getting these wrong is one of the most common real-world misconfigurations: a world-writable configuration file or an overly permissive script is a foothold for privilege escalation, which you will exploit deliberately in Week 11 and defend against in Week 7.',
        ],
        code: 'chmod 640 secrets.conf   # owner: read/write, group: read, others: nothing\nchown alice:devteam secrets.conf',
      },
      {
        heading: 'Processes, packages, and keeping a system observable',
        paragraphs: [
          'ps and top show you what is currently running; kill (and its more forceful sibling, kill -9) stops a process; systemctl manages services that should start automatically. Package managers (apt on Debian/Ubuntu, yum/dnf on RHEL-family systems) install and update software from trusted repositories, which matters because it is one of your main defenses against installing tampered software by accident.',
        ],
        callout: {
          label: 'Connects forward',
          text: 'In Week 7 you will use these exact commands to find and disable unnecessary services as part of hardening a box — reducing what is running is reducing what can be attacked.',
        },
      },
      {
        heading: 'Text processing: the real superpower',
        paragraphs: [
          'Security work is mostly reading huge amounts of text — logs, configuration files, command output — and finding the few lines that matter. grep searches for patterns, sed and awk transform text, cut and sort and uniq reorganize it. Piping (|) lets you chain these together so the output of one command becomes the input of the next.',
          'A common trap with fixed-column tools like awk: a failed-login log line has a different number of words when the attempted username does not exist ("Failed password for invalid user admin from...") versus when it does ("Failed password for root from..."), which silently shifts which column the IP address sits in. Extracting by pattern instead of column position avoids that trap entirely.',
        ],
        code: "grep 'Failed password' /var/log/auth.log | grep -oP '(?<=from )[\\d.]+' | sort | uniq -c | sort -rn",
        codeLabel: 'Find and count failed SSH logins by source IP, regardless of line format',
      },
      {
        heading: 'Users, groups, and sudo',
        paragraphs: [
          'Linux enforces the principle of least privilege at the OS level: normal users cannot modify system files or other users\' data, and administrative actions require sudo (temporarily elevating a permitted user to root). Every sudo action is logged — which is exactly the kind of log entry you will learn to hunt through in Week 13.',
        ],
      },
    ],
    takeaways: [
      'Permissions and ownership (chmod/chown) are the first line of defense on any Linux box.',
      'ps, top, kill, and systemctl let you see and control what is actually running.',
      'grep, awk, sed, cut, sort, and uniq piped together are how real log analysis gets done.',
      'sudo enforces least privilege and creates an audit trail — both matter for security, not just convenience.',
    ],
  },

  w03: {
    intro:
      'You now have one operating system down. Week 3 covers the other one that runs most of the corporate world: Windows, plus Active Directory, the identity system that almost every mid-size-or-larger organization runs on. You will come back to AD security specifically in Week 8, and to Windows logs specifically in Week 13 — this week is the foundation both of those build on.',
    builtOn: ['Week 1 — How Computers & Networks Actually Work', 'Week 2 — Linux Command Line for Security Work'],
    sections: [
      {
        heading: 'The Windows security model',
        paragraphs: [
          'Where Linux identifies users by username and numeric UID, Windows identifies every user, group, and computer with a Security Identifier (SID) — a long, unique string that stays constant even if you rename the account. Access Control Lists (ACLs) attached to files and objects list exactly which SIDs get which permissions, and a security token generated at login carries a user\'s SID and group memberships into every action they take.',
          'User Account Control (UAC) is the "Do you want to allow this app to make changes?" prompt — it is Windows\' equivalent of sudo, running most processes with standard privileges by default and requiring explicit elevation for administrative actions.',
        ],
      },
      {
        heading: 'Active Directory: domains, forests, OUs, and GPOs',
        paragraphs: [
          'Active Directory (AD) is a centralized directory service: instead of managing user accounts separately on every machine, an organization manages them once, in a domain, and every joined computer trusts that domain to authenticate users. A forest is a collection of one or more domains that trust each other; Organizational Units (OUs) let admins organize users and computers into logical groups (e.g. "Finance", "Laptops") for the purpose of applying policy.',
          'Group Policy Objects (GPOs) are how an admin pushes a setting — a password policy, a desktop background, a firewall rule — to every computer or user in an OU, automatically, without touching each machine by hand. This is both an enormous administrative convenience and, if misconfigured, a very efficient way to push a bad setting (or a compromise) to an entire organization at once.',
        ],
        callout: {
          label: 'Why this matters',
          text: 'Because AD centralizes identity for an entire organization, it is also the single highest-value target for an attacker who gets a foothold anywhere on the network. Week 8 is entirely dedicated to how AD gets attacked and defended.',
        },
      },
      {
        heading: 'Authentication: NTLM vs. Kerberos, at a glance',
        paragraphs: [
          'NTLM is an older, weaker challenge-response authentication protocol still present for backward compatibility. Kerberos is the modern default in AD environments: instead of sending a password (or its hash) around the network repeatedly, a user gets a time-limited "ticket" from a trusted authority (the Key Distribution Center) and presents that ticket to access resources. You do not need to memorize the full Kerberos exchange yet — just that "ticket-based" is the concept, and that Week 8 will show you exactly how attackers abuse this ticket system (Kerberoasting).',
        ],
      },
      {
        heading: 'Event Viewer and PowerShell',
        paragraphs: [
          'Windows logs security-relevant events (logins, privilege use, object access) into Event Viewer, organized into logs like Security, System, and Application — this is your primary evidence source on a Windows box, and you will rely on it heavily in Week 13\'s SOC work and Week 15\'s forensics.',
          'PowerShell is Windows\' scripting shell and management interface — the direct equivalent of what Bash gave you in Week 2, but object-oriented rather than pure text. Nearly every administrative and defensive task on Windows (and a great many attacks) happen through PowerShell, which is why it is worth getting comfortable with it now rather than later.',
        ],
        code: 'Get-LocalGroupMember -Group "Administrators" | Export-Csv local_admins.csv -NoTypeInformation',
        codeLabel: "This week's PowerShell hands-on task",
      },
    ],
    takeaways: [
      'SIDs and ACLs are how Windows tracks identity and permissions — the direct analog of Linux UIDs and permission bits.',
      'Active Directory centralizes identity for a whole organization via domains, OUs, and GPOs.',
      'Kerberos replaced NTLM as the default authentication protocol by using time-limited tickets instead of passing credentials around.',
      'Event Viewer and PowerShell are the Windows equivalents of Linux logs and Bash — you will use both constantly from here on.',
    ],
  },

  w04: {
    intro:
      'You now have real technical footing in both operating systems and how networks move data. Before going any further, you need the shared vocabulary and mental models that every later module — offense, defense, forensics, governance — assumes you already have. This is the week that turns "I can use a terminal" into "I think like a security person."',
    builtOn: ['Week 1 — How Computers & Networks Actually Work', 'Week 2 — Linux Command Line for Security Work', 'Week 3 — Windows Internals & Active Directory Basics'],
    sections: [
      {
        heading: 'The CIA triad and AAA',
        paragraphs: [
          'Nearly every security decision is ultimately about protecting Confidentiality (only authorized people can read it), Integrity (only authorized people can change it, and you can tell if it was changed), and Availability (it is there when it is needed). A ransomware attack is primarily an availability attack. A data leak is a confidentiality failure. A tampered log file is an integrity failure.',
          'AAA — Authentication (proving who you are), Authorization (what you are allowed to do), and Accounting (a record of what you actually did) — is the practical framework underneath identity systems like the AD you studied in Week 3. Non-repudiation, a related idea, means someone cannot credibly deny having taken an action, because there is verifiable proof they did.',
        ],
      },
      {
        heading: 'Threat actors: who is actually out there',
        paragraphs: [
          'Not all attackers are the same, and their motivation changes what they will and will not do. Script kiddies use existing tools without deep understanding, usually for low-stakes mischief. Hacktivists attack for a cause. Organized crime attacks for money — ransomware is now largely a criminal business model, not chaos. Nation-states have the most resources and patience, and often the goal is espionage rather than immediate damage. Insiders — a current or former employee — bypass most external defenses entirely because they already have legitimate access.',
        ],
        bullets: [
          'Script kiddies: low skill, existing tools, opportunistic',
          'Hacktivists: ideological motivation, often defacement or leaks',
          'Organized crime: financially motivated, ransomware and fraud',
          'Nation-states: high resources, patience, often espionage',
          'Insiders: legitimate access already granted, hardest to detect by network defenses alone',
        ],
      },
      {
        heading: 'The Cyber Kill Chain and an introduction to MITRE ATT&CK',
        paragraphs: [
          'The Cyber Kill Chain describes an intrusion as a sequence of stages an attacker must succeed at, in order: Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control, and Actions on Objectives. The core defensive insight is that you only need to break the chain at one stage to stop the whole attack — you do not have to catch everything.',
          'MITRE ATT&CK is a far more detailed, continuously updated catalog of real-world attacker Tactics, Techniques, and Procedures, organized by the same rough progression as the Kill Chain but with dozens of specific, named techniques per stage. You will use it properly starting in Week 14 — for now, just know it exists and that it is the shared vocabulary the entire industry uses to describe attacker behavior precisely.',
        ],
        callout: {
          label: 'Try this now',
          text: 'This week\'s hands-on task asks you to map three real breach post-mortems onto the Kill Chain stages. Do this before moving on — it is the single best exercise for making these stages feel real instead of theoretical.',
        },
      },
      {
        heading: 'The security domains — and where you are headed',
        paragraphs: [
          'Cybersecurity splits into recognizable specializations: GRC (governance, risk, compliance — the policy and business side), SOC/blue team (monitoring and responding to threats), pentest/red team (authorized attacking to find weaknesses first), AppSec (securing software itself), cloud security, and forensics/incident response. This course\'s core path (Weeks 1–20) deliberately touches all of them, because a strong generalist foundation is what makes you useful in almost any of them — and because you cannot make an informed specialization choice for the Mastery Track until you have actually tried each one.',
        ],
      },
    ],
    takeaways: [
      'The CIA triad (Confidentiality, Integrity, Availability) is the lens for evaluating almost any security decision.',
      'Threat actor type changes both motivation and capability — and therefore what defense actually matters.',
      'The Kill Chain shows that breaking an attack at any single stage stops the whole thing.',
      'MITRE ATT&CK is the detailed, shared vocabulary the rest of this course (and the industry) uses for attacker behavior.',
      'You now have enough of a map to start choosing which specialization interests you most — keep that in mind as the phases ahead get more hands-on.',
    ],
  },
}
