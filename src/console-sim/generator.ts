import { dir, file } from '../terminal-sim/filesystem'
import { mulberry32, pick, randInt } from './prng'
import { STARTER_WORDLIST } from './wordlist'
import type { ConsoleWorld, HostDef, VulnClass } from './types'

const PREFIXES = ['db', 'web', 'mail', 'vpn', 'dns', 'file', 'backup', 'auth', 'app', 'legacy', 'dev', 'staging', 'prod', 'api', 'cdn']
const REGIONS = ['us-east', 'eu-west', 'ap-south', 'core', 'edge', 'internal', 'dr']
const VULN_CLASSES: VulnClass[] = [
  'ftp-anon',
  'ssh-weak-creds',
  'http-default-creds',
  'sql-injection',
  'cmd-injection',
  'dir-traversal',
  'file-upload-rce',
  'jwt-none-alg',
  'cleartext-sniffing',
]
const COMMON_HTTP_CREDS = [
  { user: 'admin', pass: 'admin' },
  { user: 'admin', pass: 'password' },
  { user: 'admin', pass: 'admin123' },
  { user: 'root', pass: 'toor' },
  { user: 'administrator', pass: 'admin' },
]

const VULN_INFO: Record<VulnClass, { port: number; service: string }> = {
  'ftp-anon': { port: 21, service: 'ftp' },
  'ssh-weak-creds': { port: 22, service: 'ssh' },
  'http-default-creds': { port: 80, service: 'http' },
  'sql-injection': { port: 80, service: 'http' },
  'cmd-injection': { port: 80, service: 'http' },
  'dir-traversal': { port: 80, service: 'http' },
  'file-upload-rce': { port: 80, service: 'http' },
  'jwt-none-alg': { port: 80, service: 'http' },
  'cleartext-sniffing': { port: 23, service: 'telnet' },
}

export const STARTER_SCRIPTS: Record<string, string> = {
  'recon.js':
    "game.log('Scanning from current host...')\n" +
    'const scanResult = await game.scan()\n' +
    "game.log(scanResult.join('\\n'))\n" +
    "const map = await game.net()\n" +
    "game.log('--- known network ---')\n" +
    "game.log(map.join('\\n'))\n",
  'watch-for-incidents.js':
    "game.log('Watching the network for active incidents. Use the Stop button to end this early.')\n" +
    'for (let i = 0; i < 30; i++) {\n' +
    '  const map = await game.net()\n' +
    "  const incidentLine = map.find((line) => line.includes('ACTIVE INCIDENT'))\n" +
    '  if (incidentLine) {\n' +
    '    const hostname = incidentLine.trim().split(/\\s+/)[0]\n' +
    "    game.log('Incident on ' + hostname + ' — pulling recon...')\n" +
    '    const info = await game.nmap(hostname, true)\n' +
    "    game.log(info.join('\\n'))\n" +
    "    game.log('Now go work out the real technique yourself — this script only watches, it does not exploit anything for you.')\n" +
    '  } else {\n' +
    "    game.log('No active incident (' + i + '/30).')\n" +
    '  }\n' +
    '  await game.sleep(4000)\n' +
    '}\n',
}

function randomHostname(rand: () => number, used: Set<string>): string {
  let name = ''
  do {
    name = `${pick(rand, PREFIXES)}-${pick(rand, REGIONS)}-${String(randInt(rand, 1, 99)).padStart(2, '0')}`
  } while (used.has(name))
  used.add(name)
  return name
}

function randomIp(rand: () => number): string {
  return `10.${randInt(rand, 0, 9)}.${randInt(rand, 0, 254)}.${randInt(rand, 1, 254)}`
}

function randomPassword(rand: () => number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$'
  let out = ''
  for (let i = 0; i < 12; i++) out += chars[Math.floor(rand() * chars.length)]
  return out
}

function bannerFor(vulnClass: VulnClass): string {
  switch (vulnClass) {
    case 'ftp-anon':
      return 'vsftpd 2.3.4'
    case 'ssh-weak-creds':
      return 'OpenSSH 7.2p2 (Ubuntu)'
    case 'http-default-creds':
      return 'nginx 1.18.0 — Corp Portal v2 login page at /login'
    case 'sql-injection':
      return 'Apache 2.4.29 — legacy PHP login form at /login (unpatched since 2019)'
    case 'cmd-injection':
      return 'nginx — internal diagnostics tool at /ping'
    case 'dir-traversal':
      return 'nginx — file download portal at /download?file='
    case 'file-upload-rce':
      return 'Apache — profile picture upload form at /upload'
    case 'jwt-none-alg':
      return 'nginx — REST API, JWT-authenticated admin endpoint at /api/admin'
    case 'cleartext-sniffing':
      return 'Linux telnetd (unencrypted remote access)'
  }
}

function buildHostFilesystem(rand: () => number, otherHostIds: string[], sshUser: string, sshPassword: string) {
  const files: Record<string, ReturnType<typeof file> | ReturnType<typeof dir>> = {
    'motd.txt': file('This host is part of an internal network segment. Access is logged.\n'),
    // Real HTB/THM convention: the root flag lives at /root/root.txt, not bare at /.
    root: dir({ 'root.txt': file(`flag{${randomPassword(rand)}}\n`, 0o600, 'root', 'root') }, 0o700, 'root', 'root'),
    // Present on every host so a directory-traversal attempt can genuinely be tried anywhere —
    // it only actually escapes /var/www/downloads on hosts that fail to sanitize it.
    var: dir({
      www: dir({
        downloads: dir({ 'report.pdf': file('%PDF-1.4 (fake binary content, quarterly-report)\n') }),
      }),
    }),
    etc: dir({
      'app-secrets.conf': file(`# not meant to be served publicly\nssh_user=${sshUser}\nssh_password=${sshPassword}\n`, 0o644, 'root', 'root'),
    }),
  }
  const hasCreds = rand() < 0.25 && otherHostIds.length > 0
  if (hasCreds) {
    const credsTarget = pick(rand, otherHostIds)
    // Deliberately world-readable (0o644) — "a note file left with lax permissions" is itself
    // a realistic finding, and it means whichever foothold user lands here can actually read it.
    files['creds.txt'] = file(
      `# found during cleanup, never got around to changing it\nhost: ${credsTarget}\nuser: svc-${pick(rand, PREFIXES)}\npass: ${pick(rand, STARTER_WORDLIST)}\n`,
    )
  }
  return dir(files)
}

export function generateWorld(seed: number): ConsoleWorld {
  const rand = mulberry32(seed)
  const used = new Set<string>(['home'])
  const HOST_COUNT = 14

  const difficultyPool: HostDef['difficulty'][] = []
  ;(['Easy', 'Easy', 'Easy', 'Easy', 'Easy', 'Easy', 'Easy', 'Medium', 'Medium', 'Medium', 'Medium', 'Hard', 'Hard', 'Hard'] as const).forEach(
    (d) => difficultyPool.push(d),
  )
  while (difficultyPool.length < HOST_COUNT) difficultyPool.push('Easy')

  const hostIds = difficultyPool.map((_, i) => `h${i + 1}`)
  const draftHosts: Omit<HostDef, 'fs'>[] = difficultyPool.map((difficulty, i) => {
    const vulnClass = pick(rand, VULN_CLASSES)
    const info = VULN_INFO[vulnClass]
    const rewardScale = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3

    let sshPassword = randomPassword(rand)
    if (vulnClass === 'ssh-weak-creds') {
      // Easy: password sits early in the list (fast to find). Hard: further down —
      // still genuinely in the file, hydra still has to do real work to reach it.
      const band = difficulty === 'Easy' ? [0, 10] : difficulty === 'Medium' ? [8, 20] : [18, STARTER_WORDLIST.length]
      const idx = randInt(rand, band[0], Math.min(band[1], STARTER_WORDLIST.length) - 1)
      sshPassword = STARTER_WORDLIST[idx]
    }

    const httpCred = pick(rand, COMMON_HTTP_CREDS)

    return {
      id: hostIds[i],
      hostname: randomHostname(rand, used),
      ip: randomIp(rand),
      difficulty,
      vulnClass,
      port: info.port,
      service: info.service,
      banner: bannerFor(vulnClass),
      sshUser: `svc-${pick(rand, PREFIXES)}`,
      sshPassword,
      dbUsername: 'admin',
      dbPassword: randomPassword(rand),
      httpUser: vulnClass === 'http-default-creds' ? httpCred.user : 'admin',
      httpPass: vulnClass === 'http-default-creds' ? httpCred.pass : randomPassword(rand),
      connections: [],
      moneyReward: rewardScale * 400 + randInt(rand, 0, 150),
      repReward: rewardScale * 20,
      sudoRules: ['cat /root/root.txt'],
      discovered: false,
      userCompromised: false,
      rootObtained: false,
      credsFound: false,
      isIncident: false,
      incidentExpiresAt: null,
      incidentResolved: null,
    }
  })

  const homeConnections: string[] = []
  const placed: string[] = ['home']
  const easyHosts = draftHosts.filter((h) => h.difficulty === 'Easy')
  const firstTwo = easyHosts.slice(0, 2)
  for (const h of firstTwo) {
    homeConnections.push(h.id)
    placed.push(h.id)
  }
  for (const h of draftHosts) {
    if (placed.includes(h.id)) continue
    const from = pick(rand, placed)
    if (from === 'home') homeConnections.push(h.id)
    else {
      const fromHost = draftHosts.find((d) => d.id === from)!
      fromHost.connections.push(h.id)
      h.connections.push(from)
    }
    placed.push(h.id)
  }
  for (let i = 0; i < 4; i++) {
    const a = pick(rand, draftHosts)
    const b = pick(rand, draftHosts)
    if (a.id !== b.id && !a.connections.includes(b.id)) {
      a.connections.push(b.id)
      b.connections.push(a.id)
    }
  }

  const hosts: HostDef[] = draftHosts.map((h) => {
    const otherIds = draftHosts.filter((d) => d.id !== h.id).map((d) => d.id)
    const fs = buildHostFilesystem(rand, otherIds, h.sshUser, h.sshPassword)
    return { ...h, fs }
  })

  const homeHost: HostDef = {
    id: 'home',
    hostname: 'home',
    ip: '127.0.0.1',
    difficulty: 'Easy',
    vulnClass: 'ftp-anon',
    port: 0,
    service: '',
    banner: '',
    sshUser: '',
    sshPassword: '',
    dbUsername: '',
    dbPassword: '',
    httpUser: '',
    httpPass: '',
    connections: homeConnections,
    moneyReward: 0,
    repReward: 0,
    sudoRules: [],
    discovered: true,
    userCompromised: true,
    rootObtained: true,
    credsFound: false,
    isIncident: false,
    incidentExpiresAt: null,
    incidentResolved: null,
    fs: dir({
      wordlists: dir({ 'common.txt': file(STARTER_WORDLIST.join('\n') + '\n') }),
      'welcome.txt': file(
        'This is your home terminal. Nothing here is fake-labeled — every technique below is real and manual.\n\n' +
          'scan / net / analyze via `nmap` — real recon, real port and banner output.\n' +
          'curl <host>/<path> [-X POST] [-d "a=b&c=d"] — real HTTP requests you construct yourself.\n' +
          'ftp <host> — check for anonymous FTP access.\n' +
          'hydra -l <user> -P <wordlist> ssh://<host> — real brute force against a real file, line by line.\n' +
          'connect <host> — once you actually have working access.\n' +
          'Then real fs commands (ls, cat, find, sudo -l, sudo <cmd>...) to escalate to root.\n\n' +
          'Type `methodology` for real command examples of each technique class — not answers for any specific host.\n',
      ),
    }),
  }

  return {
    version: 5,
    seed,
    homeId: 'home',
    currentHostId: 'home',
    currentUser: 'operator',
    cwd: '/',
    hosts: [homeHost, ...hosts],
    player: { money: 0, rep: 0, xp: 0, vulnClassesUsed: [] },
    scripts: { ...STARTER_SCRIPTS },
    incidentsResolved: 0,
    incidentsMissed: 0,
  }
}
