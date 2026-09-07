import type { ShellState, VDir } from './types'
import { formatMode, getNode, getParentDir, normalizePath, parseMode } from './filesystem'

export class ShellError extends Error {}

export type CommandFn = (args: string[], input: string[] | null, state: ShellState) => string[]

function flagArgs(args: string[]): { flags: string[]; positional: string[] } {
  const flags: string[] = []
  const positional: string[] = []
  for (const a of args) {
    if (a.startsWith('-') && a !== '-') flags.push(a)
    else positional.push(a)
  }
  return { flags, positional }
}

// Real Unix permission semantics (simplified: no group-membership model beyond "are you the
// owner"). Root bypasses every check, exactly like real root does.
function canRead(node: { owner: string; mode: number }, state: ShellState): boolean {
  if (state.user === 'root') return true
  if (node.owner === state.user) return !!(node.mode & 0o400)
  return !!(node.mode & 0o004)
}

function canWrite(node: { owner: string; mode: number }, state: ShellState): boolean {
  if (state.user === 'root') return true
  if (node.owner === state.user) return !!(node.mode & 0o200)
  return !!(node.mode & 0o002)
}

const ls: CommandFn = (args, _input, state) => {
  const { flags, positional } = flagArgs(args)
  const showAll = flags.some((f) => f.includes('a'))
  const long = flags.some((f) => f.includes('l'))
  const pathArg = positional[0] ?? '.'
  const path = normalizePath(state.cwd, pathArg)
  const node = getNode(state.root, path)
  if (!node) throw new ShellError(`ls: cannot access '${pathArg}': No such file or directory`)
  if (node.type === 'file') {
    return [long ? `${formatMode(node.mode, false)} ${node.owner} ${node.group} ${pathArg}` : pathArg]
  }
  const names = Object.keys(node.children)
    .filter((n) => showAll || !n.startsWith('.'))
    .sort()
  if (names.length === 0) return []
  if (!long) return [names.map((n) => (node.children[n].type === 'dir' ? `${n}/` : n)).join('  ')]
  return names.map((name) => {
    const child = node.children[name]
    return `${formatMode(child.mode, child.type === 'dir')} ${child.owner.padEnd(8)} ${child.group.padEnd(8)} ${name}${child.type === 'dir' ? '/' : ''}`
  })
}

const cd: CommandFn = (args, _input, state) => {
  const target = args[0] ?? '/'
  const path = normalizePath(state.cwd, target)
  const node = getNode(state.root, path)
  if (!node) throw new ShellError(`cd: no such file or directory: ${target}`)
  if (node.type !== 'dir') throw new ShellError(`cd: not a directory: ${target}`)
  state.cwd = path
  return []
}

const pwd: CommandFn = (_args, _input, state) => [state.cwd]

const cat: CommandFn = (args, _input, state) => {
  if (args.length === 0) throw new ShellError('cat: missing file operand')
  const out: string[] = []
  for (const arg of args) {
    const path = normalizePath(state.cwd, arg)
    const node = getNode(state.root, path)
    if (!node) throw new ShellError(`cat: ${arg}: No such file or directory`)
    if (node.type !== 'file') throw new ShellError(`cat: ${arg}: Is a directory`)
    if (!canRead(node, state)) throw new ShellError(`cat: ${arg}: Permission denied`)
    state.flags[`viewed:${path}`] = true
    out.push(...node.content.split('\n'))
  }
  return out
}

const grep: CommandFn = (args, input, state) => {
  const { flags, positional } = flagArgs(args)
  const ignoreCase = flags.some((f) => f.includes('i'))
  const extractOnly = flags.some((f) => f.includes('o'))
  const pattern = positional[0]
  if (!pattern) throw new ShellError('grep: missing pattern')
  let lines: string[]
  if (positional[1]) {
    const path = normalizePath(state.cwd, positional[1])
    const node = getNode(state.root, path)
    if (!node || node.type !== 'file') throw new ShellError(`grep: ${positional[1]}: No such file`)
    if (!canRead(node, state)) throw new ShellError(`grep: ${positional[1]}: Permission denied`)
    state.flags[`viewed:${path}`] = true
    lines = node.content.split('\n')
  } else if (input) {
    lines = input
  } else {
    throw new ShellError('grep: no input (pipe something in, or give a file argument)')
  }
  let re: RegExp
  try {
    re = new RegExp(pattern, ignoreCase ? 'i' : '')
  } catch {
    throw new ShellError(`grep: invalid pattern: ${pattern}`)
  }
  const out: string[] = []
  for (const line of lines) {
    const m = line.match(re)
    if (m) out.push(extractOnly ? m[0] : line)
  }
  return out
}

const chmod: CommandFn = (args, _input, state) => {
  const [modeArg, pathArg] = args
  if (!modeArg || !pathArg) throw new ShellError('chmod: usage: chmod <mode> <path>')
  const path = normalizePath(state.cwd, pathArg)
  const node = getNode(state.root, path)
  if (!node) throw new ShellError(`chmod: cannot access '${pathArg}': No such file or directory`)
  if (state.user !== 'root' && node.owner !== state.user) throw new ShellError(`chmod: changing permissions of '${pathArg}': Operation not permitted`)
  const newMode = parseMode(modeArg, node.mode)
  if (newMode === null) throw new ShellError(`chmod: invalid mode: ${modeArg}`)
  node.mode = newMode
  return []
}

const chown: CommandFn = (args, _input, state) => {
  const [ownerArg, pathArg] = args
  if (!ownerArg || !pathArg) throw new ShellError('chown: usage: chown <owner[:group]> <path>')
  const path = normalizePath(state.cwd, pathArg)
  const node = getNode(state.root, path)
  if (!node) throw new ShellError(`chown: cannot access '${pathArg}': No such file or directory`)
  if (state.user !== 'root') throw new ShellError(`chown: changing ownership of '${pathArg}': Operation not permitted`)
  const [owner, group] = ownerArg.split(':')
  node.owner = owner
  if (group) node.group = group
  return []
}

const rm: CommandFn = (args, _input, state) => {
  const { flags, positional } = flagArgs(args)
  const recursive = flags.some((f) => f.includes('r'))
  const pathArg = positional[0]
  if (!pathArg) throw new ShellError('rm: missing operand')
  const path = normalizePath(state.cwd, pathArg)
  const node = getNode(state.root, path)
  if (!node) throw new ShellError(`rm: cannot remove '${pathArg}': No such file or directory`)
  if (node.type === 'dir' && !recursive) throw new ShellError(`rm: cannot remove '${pathArg}': Is a directory (use -r)`)
  const parentInfo = getParentDir(state.root, path)
  if (!parentInfo) throw new ShellError(`rm: cannot remove '${pathArg}': permission denied`)
  if (!canWrite(parentInfo.parent, state)) throw new ShellError(`rm: cannot remove '${pathArg}': Permission denied`)
  delete parentInfo.parent.children[parentInfo.name]
  return []
}

const whoami: CommandFn = (_args, _input, state) => [state.user]

const id: CommandFn = (_args, _input, state) => [`uid=1000(${state.user}) gid=1000(${state.user}) groups=1000(${state.user})`]

const ps: CommandFn = (_args, _input, state) => {
  const header = 'USER       PID  COMMAND'
  const rows = state.processes.map((p) => `${p.user.padEnd(10)} ${String(p.pid).padEnd(4)} ${p.cmd}`)
  return [header, ...rows]
}

const kill: CommandFn = (args, _input, state) => {
  const pidArg = args.find((a) => /^\d+$/.test(a))
  if (!pidArg) throw new ShellError('kill: usage: kill [-9] <pid>')
  const pid = parseInt(pidArg, 10)
  const index = state.processes.findIndex((p) => p.pid === pid)
  if (index === -1) throw new ShellError(`kill: (${pid}): No such process`)
  const target = state.processes[index]
  if (state.user !== 'root' && target.user !== state.user) {
    throw new ShellError(`kill: (${pid}): Operation not permitted`)
  }
  state.processes.splice(index, 1)
  return []
}

const systemctl: CommandFn = (args, _input, state) => {
  const [action, service] = args.filter((a) => a !== '--now')
  if (!action) throw new ShellError('systemctl: usage: systemctl <status|start|stop|enable|disable> <service>')
  if (action === 'status') {
    if (!service) throw new ShellError('systemctl: which service?')
    return [`${service}: ${state.services[service] ?? 'unknown'}`]
  }
  if (!service) throw new ShellError('systemctl: which service?')
  if (!(service in state.services)) throw new ShellError(`systemctl: unit ${service}.service not found`)
  if (action === 'stop' || action === 'disable') state.services[service] = 'inactive'
  else if (action === 'start' || action === 'enable') state.services[service] = 'active'
  else throw new ShellError(`systemctl: unknown action: ${action}`)
  return [`${service}: ${state.services[service]}`]
}

const nmap: CommandFn = (args, _input, state) => {
  const { flags, positional } = flagArgs(args)
  const withVersion = flags.some((f) => f.includes('sV') || f === '-sV')
  const hostDiscovery = flags.some((f) => f === '-sn')
  const target = positional[0]
  if (!target) throw new ShellError('nmap: specify a target')
  if (hostDiscovery) {
    state.flags['discovered-hosts'] = true
    return state.hosts.map((h) => `Host ${h.ip} is up.`)
  }
  const host = state.hosts.find((h) => h.ip === target)
  if (!host) return [`Note: Host seems down (no response from ${target}).`]
  if (withVersion) state.flags[`scanned-sv:${host.ip}`] = true
  const out = [`Nmap scan report for ${host.ip}`]
  for (const p of host.ports) {
    out.push(withVersion ? `${p.port}/tcp open  ${p.service}  ${p.version ?? ''}`.trim() : `${p.port}/tcp open  ${p.service}`)
  }
  return out
}

const find: CommandFn = (args, _input, state) => {
  const nameIdx = args.indexOf('-name')
  const namePattern = nameIdx >= 0 ? args[nameIdx + 1] : undefined
  const startArg = args.find((a) => !a.startsWith('-') && a !== namePattern) ?? '.'
  const startPath = normalizePath(state.cwd, startArg)
  const startNode = getNode(state.root, startPath)
  if (!startNode) throw new ShellError(`find: '${startArg}': No such file or directory`)
  const results: string[] = []
  const walk = (node: VDir, path: string) => {
    for (const [name, child] of Object.entries(node.children)) {
      const childPath = `${path === '/' ? '' : path}/${name}`
      if (!namePattern || name.includes(namePattern.replace(/\*/g, ''))) results.push(childPath)
      if (child.type === 'dir') walk(child, childPath)
    }
  }
  if (startNode.type === 'dir') walk(startNode, startPath)
  return results
}

function requireInput(input: string[] | null, cmd: string): string[] {
  if (!input) throw new ShellError(`${cmd}: no input piped in`)
  return input
}

const sortCmd: CommandFn = (args, input) => {
  const lines = [...requireInput(input, 'sort')]
  const numeric = args.includes('-n')
  const reverse = args.includes('-r')
  lines.sort((a, b) => (numeric ? parseFloat(a) - parseFloat(b) : a.localeCompare(b)))
  if (reverse) lines.reverse()
  return lines
}

const uniqCmd: CommandFn = (args, input) => {
  const lines = requireInput(input, 'uniq')
  const withCount = args.includes('-c')
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    let count = 1
    while (i + count < lines.length && lines[i + count] === lines[i]) count++
    out.push(withCount ? `${String(count).padStart(4)} ${lines[i]}` : lines[i])
    i += count
  }
  return out
}

const headCmd: CommandFn = (args, input) => {
  const lines = requireInput(input, 'head')
  const nIdx = args.indexOf('-n')
  const n = nIdx >= 0 ? parseInt(args[nIdx + 1], 10) : 10
  return lines.slice(0, n)
}

const wcCmd: CommandFn = (args, input) => {
  const lines = requireInput(input, 'wc')
  if (args.includes('-l')) return [String(lines.length)]
  return [String(lines.length)]
}

const echoCmd: CommandFn = (args) => {
  const filtered = args[0] === '-n' ? args.slice(1) : args
  return [filtered.join(' ')]
}

const base64Cmd: CommandFn = (args, input) => {
  const decode = args.includes('-d') || args.includes('--decode')
  const raw = input ? input.join('\n') : args.filter((a) => !a.startsWith('-')).join(' ')
  try {
    if (decode) {
      const normalized = raw.trim().replace(/-/g, '+').replace(/_/g, '/')
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
      return [atob(padded)]
    }
    return [btoa(raw)]
  } catch {
    throw new ShellError('base64: invalid input')
  }
}

const sudoCmd: CommandFn = (args, _input, state) => {
  const rules = state.sudoRules ?? []
  if (args[0] === '-l') {
    if (rules.length === 0) return [`User ${state.user} may not run sudo on this host.`]
    return [`User ${state.user} may run the following commands on this host:`, ...rules.map((r) => `    (root) NOPASSWD: ${r}`)]
  }
  const attempted = args.join(' ')
  if (!attempted) throw new ShellError('sudo: usage: sudo <command> — or sudo -l to list what you can run')
  const allowed = rules.some((rule) => attempted === rule || attempted.startsWith(`${rule} `))
  if (!allowed) throw new ShellError(`Sorry, user ${state.user} is not allowed to run "${attempted}" as root on this host.`)
  const previousUser = state.user
  state.user = 'root'
  try {
    return runLine(attempted, state)
  } finally {
    state.user = previousUser
  }
}

const submitCmd: CommandFn = (args, _input, state) => {
  const [key, ...rest] = args
  if (!key || rest.length === 0) throw new ShellError('submit: usage: submit <key> <value>')
  state.submissions[key] = rest.join(' ')
  return [`Recorded: ${key} = ${rest.join(' ')}`]
}

export const COMMANDS: Record<string, CommandFn> = {
  ls,
  cd,
  pwd,
  cat,
  grep,
  chmod,
  chown,
  rm,
  whoami,
  id,
  ps,
  kill,
  systemctl,
  nmap,
  find,
  sort: sortCmd,
  uniq: uniqCmd,
  head: headCmd,
  wc: wcCmd,
  echo: echoCmd,
  base64: base64Cmd,
  submit: submitCmd,
  sudo: sudoCmd,
}

export function tokenize(line: string): string[] {
  const tokens: string[] = []
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    tokens.push(m[1] ?? m[2] ?? m[3])
  }
  return tokens
}

export function runLine(line: string, state: ShellState): string[] {
  const segments = line.split('|').map((s) => s.trim())
  let pipedInput: string[] | null = null
  let output: string[] = []
  for (const segment of segments) {
    const tokens = tokenize(segment)
    if (tokens.length === 0) continue
    const [cmdName, ...args] = tokens
    const cmd = COMMANDS[cmdName]
    if (!cmd) {
      throw new ShellError(`${cmdName}: command not found`)
    }
    output = cmd(args, pipedInput, state)
    pipedInput = output
  }
  return output
}
