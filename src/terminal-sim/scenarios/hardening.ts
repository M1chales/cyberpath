import { dir, file, getNode } from '../filesystem'
import type { Scenario, ShellState } from '../types'

function buildInitialState(): ShellState {
  const root = dir({
    root: dir(
      {
        'checklist.txt': file(
          'Findings from last night\'s vulnerability scan:\n' +
            '1) /opt/app/secrets.conf is world-readable\n' +
            '2) /home/deploy/.ssh/id_rsa is not locked down\n' +
            '3) legacy-ftp and cups are running and not needed on this box\n',
          0o644,
          'root',
          'root',
        ),
      },
      0o700,
      'root',
      'root',
    ),
    opt: dir({
      app: dir({
        'secrets.conf': file('API_KEY=sk_live_9f8a2b1c\nDB_PASSWORD=hunter2\n', 0o644, 'app', 'app'),
      }),
    }),
    home: dir({
      deploy: dir(
        {
          '.ssh': dir(
            {
              id_rsa: file('-----BEGIN OPENSSH PRIVATE KEY-----\n[...]\n-----END OPENSSH PRIVATE KEY-----\n', 0o644, 'deploy', 'deploy'),
            },
            0o700,
            'deploy',
            'deploy',
          ),
        },
        0o755,
        'deploy',
        'deploy',
      ),
    }),
  })

  return {
    root,
    cwd: '/root',
    user: 'root',
    processes: [{ pid: 1, user: 'root', cmd: '/sbin/init' }],
    services: { 'legacy-ftp': 'active', cups: 'active', sshd: 'active' },
    hosts: [],
    flags: {},
    submissions: {},
  }
}

export const HARDENING_SCENARIO: Scenario = {
  id: 'sim-hardening',
  title: 'Hardening Sprint',
  emoji: '🔧',
  prompt: 'root@fresh-server:~#',
  briefing: [
    'A vulnerability scan flagged three findings on this freshly-installed server.',
    'Read /root/checklist.txt, then fix all three before this box goes anywhere near production.',
  ],
  buildInitialState,
  objectives: [
    {
      id: 'fixed-secrets',
      label: 'Lock down /opt/app/secrets.conf so others have no access',
      check: (s) => {
        const n = getNode(s.root, '/opt/app/secrets.conf')
        return !!n && n.type === 'file' && (n.mode & 0o007) === 0
      },
    },
    {
      id: 'fixed-ssh-key',
      label: 'Lock down /home/deploy/.ssh/id_rsa (no group or other access)',
      check: (s) => {
        const n = getNode(s.root, '/home/deploy/.ssh/id_rsa')
        return !!n && n.type === 'file' && (n.mode & 0o077) === 0
      },
    },
    {
      id: 'disabled-services',
      label: 'Disable legacy-ftp and cups',
      check: (s) => s.services['legacy-ftp'] === 'inactive' && s.services['cups'] === 'inactive',
    },
  ],
  commands: ['ls', 'cat', 'chmod', 'systemctl'],
  hints: [
    'Start with `cat checklist.txt` if you have not already.',
    '`ls -l /opt/app/` shows you the current permissions before you change anything.',
    'chmod 640 removes all access for "others" while keeping owner read/write and group read.',
    'A private key should be 600 — no group or other access at all.',
    '`systemctl disable --now <service>` stops it now and keeps it from starting again on reboot.',
  ],
}
