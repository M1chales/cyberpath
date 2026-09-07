import { dir, file } from '../filesystem'
import type { Scenario, ShellState } from '../types'

function buildInitialState(): ShellState {
  const root = dir({
    home: dir({
      operator: dir(
        {
          'scope.txt': file(
            'Authorized scope: 10.0.0.0/24\nFind the highest-risk host and report the host and port.\n' +
              'Use: submit host <ip>   and   submit port <port>\n',
            0o644,
            'operator',
            'operator',
          ),
        },
        0o755,
        'operator',
        'operator',
      ),
    }),
  })

  return {
    root,
    cwd: '/home/operator',
    user: 'operator',
    processes: [{ pid: 1, user: 'root', cmd: '/sbin/init' }],
    services: {},
    hosts: [
      {
        ip: '10.0.0.5',
        ports: [
          { port: 80, service: 'http', version: 'Apache 2.4.41' },
          { port: 443, service: 'https', version: 'Apache 2.4.41' },
        ],
      },
      {
        ip: '10.0.0.8',
        ports: [
          { port: 22, service: 'ssh', version: 'OpenSSH 8.2' },
          { port: 25, service: 'smtp', version: 'Postfix' },
        ],
      },
      {
        ip: '10.0.0.12',
        ports: [
          { port: 21, service: 'ftp', version: 'vsftpd 2.3.4' },
          { port: 23, service: 'telnet', version: 'Linux telnetd' },
          { port: 3389, service: 'ms-wbt-server', version: 'Microsoft Terminal Services' },
        ],
      },
    ],
    flags: {},
    submissions: {},
  }
}

export const RECON_SCENARIO: Scenario = {
  id: 'sim-recon',
  title: 'Recon Range',
  emoji: '📡',
  prompt: 'operator@kali:~$',
  briefing: [
    'You have written authorization to scan 10.0.0.0/24.',
    'Find every host, identify what is running on each, and report the single highest-risk finding.',
  ],
  buildInitialState,
  objectives: [
    {
      id: 'discovered-hosts',
      label: 'Discover which hosts are alive on the subnet',
      check: (s) => !!s.flags['discovered-hosts'],
    },
    {
      id: 'scanned-versions',
      label: 'Run a version-detection scan against the highest-risk host',
      check: (s) => !!s.flags['scanned-sv:10.0.0.12'],
    },
    {
      id: 'reported-finding',
      label: 'Submit the highest-risk host and port',
      check: (s) => s.submissions['host'] === '10.0.0.12' && (s.submissions['port'] === '21' || s.submissions['port'] === '23'),
    },
  ],
  commands: ['cat', 'nmap', 'submit'],
  hints: [
    'Start wide: `nmap -sn 10.0.0.0/24` finds which hosts respond at all.',
    'Then scan each host you found: `nmap <ip>` shows open ports.',
    'Add `-sV` to a scan to see exactly what software and version is behind each port — that\'s what tells you what is actually risky.',
    'One host is running an old FTP daemon and unencrypted telnet — both are the kind of finding that jumps the queue. Report it with `submit host <ip>` then `submit port <port>`.',
  ],
}
