import { runLine, ShellError, tokenize } from '../terminal-sim/commands'
import { getNode, normalizePath, file as makeFile } from '../terminal-sim/filesystem'
import type { ShellState } from '../terminal-sim/types'
import { attemptSqlLogin } from './sqlEngine'
import { evaluatePingEndpoint } from './cmdInjection'
import { checkJwtAdminBypass } from './jwtEngine'
import type { ConsoleWorld, HostDef } from './types'

export class ConsoleError extends Error {}

export function currentHost(world: ConsoleWorld): HostDef {
  return world.hosts.find((h) => h.id === world.currentHostId)!
}

function findDiscovered(world: ConsoleWorld, hostname: string): HostDef {
  const host = world.hosts.find((h) => h.hostname.toLowerCase() === hostname.toLowerCase() || h.id === hostname)
  if (!host || !host.discovered) throw new ConsoleError(`unknown host: ${hostname} (try \`scan\` or \`net\`)`)
  return host
}

function parseForm(dataArg: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const pair of dataArg.split('&')) {
    const [k, ...rest] = pair.split('=')
    if (k) out[decodeURIComponent(k)] = decodeURIComponent(rest.join('=') ?? '')
  }
  return out
}

function grantUserAccess(world: ConsoleWorld, host: HostDef, vulnClass: string) {
  if (!host.userCompromised) {
    host.userCompromised = true
    const half = Math.round(host.moneyReward / 2)
    const halfRep = Math.round(host.repReward / 2)
    world.player.money += half
    world.player.rep += halfRep
    world.player.xp += 25
    if (!world.player.vulnClassesUsed.includes(vulnClass)) world.player.vulnClassesUsed.push(vulnClass)
    if (host.isIncident && host.incidentResolved === 'pending') {
      host.incidentResolved = 'resolved'
      world.incidentsResolved += 1
    }
  }
}

// --- Network / recon ---

function doScan(world: ConsoleWorld): string[] {
  const host = currentHost(world)
  const revealed: string[] = []
  for (const id of host.connections) {
    const target = world.hosts.find((h) => h.id === id)!
    if (!target.discovered) {
      target.discovered = true
      revealed.push(target.hostname)
    }
  }
  if (revealed.length === 0) return ['No new hosts discovered from here.']
  return [`Discovered ${revealed.length} host(s): ${revealed.join(', ')}`, 'Use `net` for the map, or `nmap <host>` to scan one.']
}

function doNet(world: ConsoleWorld): string[] {
  const discovered = world.hosts.filter((h) => h.discovered)
  if (discovered.length === 0) return ['Nothing discovered yet — try `scan`.']
  return discovered.map((h) => {
    const status = h.rootObtained ? 'ROOTED' : h.userCompromised ? 'USER ACCESS' : h.credsFound ? 'CREDS KNOWN' : 'locked'
    const incident = h.isIncident && h.incidentResolved === 'pending' ? ' 🚨 ACTIVE INCIDENT' : ''
    return `${h.hostname.padEnd(20)} ${h.difficulty.padEnd(7)} [${status}]${incident}`
  })
}

function doNmap(world: ConsoleWorld, args: string[]): string[] {
  const withVersion = args.includes('-sV')
  const target = args.find((a) => !a.startsWith('-'))
  if (!target) throw new ConsoleError('nmap: specify a target hostname')
  const host = findDiscovered(world, target)
  const out = [`Nmap scan report for ${host.hostname} (${host.ip})`]
  if (host.port === 0) {
    out.push('No open ports found.')
    return out
  }
  out.push(withVersion ? `${host.port}/tcp open  ${host.service}  ${host.banner}` : `${host.port}/tcp open  ${host.service}`)
  if (host.isIncident && host.incidentResolved === 'pending' && host.incidentExpiresAt) {
    const secondsLeft = Math.max(0, Math.round((host.incidentExpiresAt - Date.now()) / 1000))
    out.push(`🚨 Active incident — ${secondsLeft}s remaining.`)
  }
  return out
}

// --- Initial access techniques ---

function doFtp(world: ConsoleWorld, hostname?: string): string[] {
  if (!hostname) throw new ConsoleError('ftp: usage: ftp <host>')
  const host = findDiscovered(world, hostname)
  if (host.port !== 21) throw new ConsoleError(`ftp: connect: Connection refused (no FTP service on ${host.hostname})`)
  if (host.vulnClass !== 'ftp-anon') return ['530 Login incorrect. (Anonymous access disabled.)']
  host.credsFound = true
  return [
    '220 Service ready.',
    '230 Anonymous access granted.',
    'drwxr-xr-x  backup-config.txt',
    `backup-config.txt: ssh user=${host.sshUser} pass=${host.sshPassword}`,
    'Real creds recovered from an anonymous FTP share — try `connect ' + host.hostname + '`.',
  ]
}

function doCurl(world: ConsoleWorld, args: string[]): string[] {
  const isPost = args.includes('-X') && args[args.indexOf('-X') + 1]?.toUpperCase() === 'POST'
  const dataIdx = args.indexOf('-d')
  const dataArg = dataIdx >= 0 ? args[dataIdx + 1] : undefined
  const headerIdx = args.indexOf('-H')
  const headerArg = headerIdx >= 0 ? args[headerIdx + 1] : undefined
  const isFlagValue = (i: number) => args[i - 1] === '-X' || args[i - 1] === '-d' || args[i - 1] === '-H'
  const urlArg = args.find((a, i) => !a.startsWith('-') && !isFlagValue(i))
  if (!urlArg) throw new ConsoleError('curl: usage: curl <host>/<path> [-X POST] [-d "a=b&c=d"] [-H "Header: value"]')

  const slashIdx = urlArg.indexOf('/')
  const hostname = slashIdx >= 0 ? urlArg.slice(0, slashIdx) : urlArg
  const pathAndQuery = slashIdx >= 0 ? urlArg.slice(slashIdx) : '/'
  const host = findDiscovered(world, hostname)

  if (host.port !== 80) throw new ConsoleError(`curl: (7) Failed to connect to ${host.hostname} port 80: Connection refused`)

  const [path, queryString] = pathAndQuery.split('?')
  const form = dataArg ? parseForm(dataArg) : {}
  const query = queryString ? parseForm(queryString) : {}
  const params = { ...query, ...form }

  if (path === '/login' && isPost) {
    if (host.vulnClass === 'sql-injection') {
      const result = attemptSqlLogin(params.user ?? '', params.pass ?? '', [{ username: host.dbUsername, password: host.dbPassword }])
      if (result.success) {
        host.credsFound = true
        return [
          `Welcome, ${result.matchedUser}.`,
          `[internal memo] SSH access for maintenance — user '${host.sshUser}', password '${host.sshPassword}'. Please rotate this.`,
        ]
      }
      return ['401 Invalid credentials.']
    }
    if (host.vulnClass === 'http-default-creds') {
      if (params.user === host.httpUser && params.pass === host.httpPass) {
        host.credsFound = true
        return [
          `Welcome, ${params.user}.`,
          `[internal memo] SSH access for maintenance — user '${host.sshUser}', password '${host.sshPassword}'. Please rotate this.`,
        ]
      }
      return ['401 Invalid credentials.']
    }
    return ['404 Not Found.']
  }

  if (path === '/ping' && isPost) {
    if (host.vulnClass !== 'cmd-injection') return ['404 Not Found.']
    const result = evaluatePingEndpoint(params.target ?? '')
    if (result.injected) grantUserAccess(world, host, 'cmd-injection')
    return [result.output]
  }

  if (path === '/download') {
    const requested = params.file ?? ''
    if (!requested) return ['400 Bad Request — missing file parameter.']
    const isTraversalAttempt = requested.includes('..')
    if (isTraversalAttempt && host.vulnClass !== 'dir-traversal') {
      return ['403 Forbidden — invalid filename.']
    }
    const resolved = normalizePath('/var/www/downloads', requested)
    const node = getNode(host.fs, resolved)
    if (!node || node.type !== 'file') return ['404 Not Found.']
    if (isTraversalAttempt && resolved.startsWith('/etc/')) {
      host.credsFound = true
    }
    return node.content.split('\n')
  }

  if (path === '/upload' && isPost) {
    const filename = params.filename ?? ''
    const looksExecutable = /\.(php\d?|phtml|jsp|jspx|asp|aspx)$/i.test(filename)
    if (!looksExecutable) return ['400 Bad Request — no recognizable filename/extension.']
    if (host.vulnClass !== 'file-upload-rce') {
      return ['415 Unsupported Media Type — executable file types are rejected by this upload handler.']
    }
    grantUserAccess(world, host, 'file-upload-rce')
    return [`File uploaded to /uploads/${filename}`, 'Executing uploaded file...', 'uid=33(www-data) gid=33(www-data) — shell obtained.']
  }

  if (path === '/api/admin') {
    if (!headerArg) return ['401 Unauthorized — missing Authorization header.']
    if (host.vulnClass === 'jwt-none-alg' && checkJwtAdminBypass(headerArg)) {
      host.credsFound = true
      return ['Welcome, admin.', `[backup config] ssh user=${host.sshUser} pass=${host.sshPassword}`]
    }
    return ['403 Forbidden — invalid or insufficiently privileged token.']
  }

  if (path === '/' || path === '') {
    return [`200 OK — ${host.banner}`]
  }

  return ['404 Not Found.']
}

function doHydra(world: ConsoleWorld, args: string[], readWordlist: (path: string) => string[]): string[] {
  const lIdx = args.indexOf('-l')
  const pIdx = args.indexOf('-P')
  const username = lIdx >= 0 ? args[lIdx + 1] : undefined
  const wordlistPath = pIdx >= 0 ? args[pIdx + 1] : undefined
  const target = args[args.length - 1]
  if (!username || !wordlistPath || !target) throw new ConsoleError('hydra: usage: hydra -l <user> -P <wordlist> ssh://<host>')

  const hostnameMatch = /(?:ssh:\/\/)?([\w.-]+)/.exec(target)
  const hostname = hostnameMatch ? hostnameMatch[1] : target
  const host = findDiscovered(world, hostname)
  if (host.port !== 22) throw new ConsoleError(`hydra: target port 22 closed on ${host.hostname}`)

  let lines: string[]
  try {
    lines = readWordlist(wordlistPath)
  } catch (e) {
    throw new ConsoleError(e instanceof Error ? e.message : `hydra: cannot read ${wordlistPath}`)
  }

  if (host.vulnClass !== 'ssh-weak-creds') {
    return [`hydra: ${lines.length} passwords tried, 0 valid passwords found for ${username}`]
  }

  const out = [`hydra: attacking ssh://${host.hostname} with ${lines.length} password(s) from ${wordlistPath}`]
  for (const candidate of lines) {
    if (candidate === host.sshPassword) {
      out.push(`[22][ssh] host: ${host.hostname}   login: ${username}   password: ${candidate}`)
      grantUserAccess(world, host, 'ssh-weak-creds')
      return out
    }
  }
  out.push(`hydra: ${lines.length} passwords tried, 0 valid passwords found`)
  return out
}

function doTcpdump(world: ConsoleWorld, args: string[]): string[] {
  const target = args.find((a) => !a.startsWith('-'))
  if (!target) throw new ConsoleError('tcpdump: usage: tcpdump <host> [-w <file>]')
  const host = findDiscovered(world, target)
  const wIdx = args.indexOf('-w')
  const filename = wIdx >= 0 && args[wIdx + 1] ? args[wIdx + 1] : 'capture.pcap'

  if (host.vulnClass !== 'cleartext-sniffing') {
    return [`tcpdump: listening on eth0...`, `0 packets captured (traffic to/from ${host.hostname} is encrypted or not observable from here).`]
  }

  const current = currentHost(world)
  const dirNode = getNode(current.fs, world.cwd)
  if (!dirNode || dirNode.type !== 'dir') throw new ConsoleError(`tcpdump: cannot write to ${world.cwd}: not a directory`)

  const content =
    `12:00:01.001221 IP ${host.ip}.23 > 10.0.0.4.51422: Flags [P], length 7\n` +
    `    Telnet Data: "login: "\n` +
    `12:00:02.884113 IP 10.0.0.4.51422 > ${host.ip}.23: Flags [P], length 5\n` +
    `    Telnet Data: "${host.sshUser}"\n` +
    `12:00:03.552091 IP ${host.ip}.23 > 10.0.0.4.51422: Flags [P], length 11\n` +
    `    Telnet Data: "Password: "\n` +
    `12:00:05.119004 IP 10.0.0.4.51422 > ${host.ip}.23: Flags [P], length 14\n` +
    `    Telnet Data: "${host.sshPassword}"\n\n` +
    `# extracted from capture — telnet sends every keystroke in cleartext\n` +
    `host: ${host.id}\nuser: ${host.sshUser}\npass: ${host.sshPassword}\n`

  dirNode.children[filename] = makeFile(content)
  return [
    'tcpdump: listening on eth0, link-type EN10MB (Ethernet)',
    `4 packets captured, wrote ${filename}`,
    `Use \`cat ${filename}\` or \`tshark -r ${filename}\` to read it back.`,
  ]
}

function doConnect(world: ConsoleWorld, hostname?: string): string[] {
  if (!hostname) throw new ConsoleError('connect: specify a host')
  const host = findDiscovered(world, hostname)
  if (!host.userCompromised && !host.credsFound) {
    throw new ConsoleError('connect: Permission denied (you do not have working access to this host yet).')
  }
  if (host.credsFound && !host.userCompromised) {
    grantUserAccess(world, host, host.vulnClass)
  }
  world.currentHostId = host.id
  world.currentUser = host.vulnClass === 'cmd-injection' ? 'www-data' : host.sshUser
  world.cwd = '/'
  return [`Connected to ${host.hostname} as ${world.currentUser}.`]
}

function doMethodology(): string[] {
  return [
    'Real technique syntax — none of this names which host is vulnerable to what. Recon and figure that out yourself.',
    '',
    'FTP anonymous access:      ftp <host>',
    'Default/weak web creds:    curl -X POST <host>/login -d "user=admin&pass=admin"',
    'SQL injection auth bypass: curl -X POST <host>/login -d "user=\' OR \'1\'=\'1&pass=x"',
    'Command injection:         curl -X POST <host>/ping -d "target=8.8.8.8; whoami"',
    'SSH weak credentials:      hydra -l <user> -P wordlists/common.txt ssh://<host>',
    'Directory traversal:       curl "<host>/download?file=../../etc/app-secrets.conf"',
    'Insecure file upload:      curl -X POST <host>/upload -d "filename=shell.php"',
    'Cleartext creds sniffing:  tcpdump <host> -w capture.pcap   then   tshark -r capture.pcap',
    'JWT alg:none bypass:',
    '  echo -n \'{"alg":"none","typ":"JWT"}\' | base64      (copy the output as HEADER)',
    '  echo -n \'{"role":"admin"}\' | base64                (copy the output as PAYLOAD)',
    '  curl <host>/api/admin -H "Authorization: Bearer HEADER.PAYLOAD."   (note the trailing dot — empty signature)',
    '',
    'After you have real access: connect <host>, then explore for privesc — sudo -l is a good start.',
  ]
}

// --- Filesystem delegation (real shell, real permissions, on the connected host) ---

function runFsOnHost(raw: string, world: ConsoleWorld): string[] {
  const host = currentHost(world)
  const fauxState: ShellState = {
    root: host.fs,
    cwd: world.cwd,
    user: world.currentUser,
    processes: [],
    services: {},
    hosts: [],
    flags: {},
    submissions: {},
    sudoRules: host.sudoRules,
  }
  const output = runLine(raw, fauxState)
  world.cwd = fauxState.cwd

  if (fauxState.flags['viewed:/root/root.txt'] && !host.rootObtained) {
    host.rootObtained = true
    const remainingMoney = host.moneyReward - Math.round(host.moneyReward / 2)
    const remainingRep = host.repReward - Math.round(host.repReward / 2)
    world.player.money += remainingMoney
    world.player.rep += remainingRep
    world.player.xp += host.difficulty === 'Easy' ? 50 : host.difficulty === 'Medium' ? 100 : 150
    output.push(`root.txt captured. +$${remainingMoney} · +${remainingRep} rep`)
  }

  for (const line of output) {
    const m = /host:\s*(h\d+)/i.exec(line)
    if (m) {
      const target = world.hosts.find((h) => h.id === m[1])
      if (target && target.id !== world.currentHostId) {
        target.credsFound = true
        target.discovered = true
      }
    }
  }
  return output
}

export function runConsoleCommand(raw: string, world: ConsoleWorld): string[] {
  const tokens = tokenize(raw.trim())
  if (tokens.length === 0) return []
  const [cmd, ...args] = tokens

  switch (cmd) {
    case 'scan':
      return doScan(world)
    case 'net':
    case 'map':
      return doNet(world)
    case 'nmap':
      return doNmap(world, args)
    case 'ftp':
      return doFtp(world, args[0])
    case 'curl':
      return doCurl(world, args)
    case 'tcpdump':
      return doTcpdump(world, args)
    case 'tshark': {
      const rIdx = args.indexOf('-r')
      if (rIdx < 0 || !args[rIdx + 1]) throw new ConsoleError('tshark: usage: tshark -r <file>')
      try {
        return runFsOnHost(`cat ${args[rIdx + 1]}`, world)
      } catch (e) {
        if (e instanceof ShellError) throw new ConsoleError(e.message)
        throw e
      }
    }
    case 'hydra':
      return doHydra(world, args, (path) => {
        const abs = path.startsWith('/') ? path : `${world.cwd === '/' ? '' : world.cwd}/${path}`
        const homeAbs = path.startsWith('/') ? path : `/wordlists/${path.split('/').pop()}`
        for (const candidate of [abs, path, homeAbs, `/wordlists/${path}`]) {
          const home = world.hosts.find((h) => h.id === world.homeId)!
          const parts = candidate.split('/').filter(Boolean)
          let node: (typeof home.fs) | (typeof home.fs)['children'][string] = home.fs
          let ok = true
          for (const part of parts) {
            if (node.type !== 'dir' || !node.children[part]) {
              ok = false
              break
            }
            node = node.children[part]
          }
          if (ok && node.type === 'file') return node.content.split('\n').filter((l) => l.length > 0)
        }
        throw new Error(`hydra: cannot read wordlist file "${path}" (wordlists live at /wordlists/common.txt on home)`)
      })
    case 'connect':
    case 'ssh':
      return doConnect(world, args[0])
    case 'methodology':
      return doMethodology()
    case 'home':
      world.currentHostId = world.homeId
      world.currentUser = 'operator'
      world.cwd = '/'
      return ['Connected to home.']
    case 'status':
      return [`connected: ${currentHost(world).hostname} as ${world.currentUser} · $${world.player.money} · rep ${world.player.rep}`]
    default:
      try {
        return runFsOnHost(raw, world)
      } catch (e) {
        if (e instanceof ShellError) throw new ConsoleError(e.message)
        throw e
      }
  }
}
