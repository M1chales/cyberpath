import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { runConsoleCommand, ConsoleError, currentHost } from '../console-sim/commands'
import { useScriptRunner } from '../console-sim/useScriptRunner'
import { useAppState } from '../state/AppStateContext'
import { useConsoleWorld } from '../state/ConsoleWorldContext'

interface LogEntry {
  kind: 'input' | 'output' | 'error' | 'system' | 'script'
  text: string
}

const colorFor: Record<LogEntry['kind'], string> = {
  input: 'text-slate-100',
  output: 'text-slate-300',
  error: 'text-rose-400',
  system: 'text-emerald-400',
  script: 'text-sky-300',
}

const WELCOME: LogEntry[] = [
  { kind: 'system', text: '── cyberpath Console ──' },
  { kind: 'output', text: 'A persistent, procedurally-generated network. Progress is saved automatically in this browser.' },
  {
    kind: 'output',
    text:
      'Nothing here resolves by typing a magic word. Recon with real nmap. Send real curl requests — a genuine SQL\n' +
      'injection payload works because it is one, not because you typed a label. Brute force reads an actual wordlist\n' +
      'file, line by line. Getting root means actually finding and using a real permission/sudo misconfiguration.',
  },
  {
    kind: 'output',
    text:
      'This box comes with a real toolkit pre-installed, like a security-focused Linux distro — nmap, curl, hydra, ftp,\n' +
      'tcpdump/tshark (Wireshark\'s real CLI), base64, sudo, and standard Unix tools. No purchases, no unlocks — 9\n' +
      'genuinely different vulnerability classes, each one actually evaluated, not labeled.',
  },
  { kind: 'output', text: 'Start with: scan · net · nmap -sV <host> · methodology (real command examples for each class) · help' },
]

export default function Console() {
  const { world, mutateWorld, resetConsole, activeIncident } = useConsoleWorld()
  const { recordGameResult } = useAppState()
  const [log, setLog] = useState<LogEntry[]>(WELCOME)
  // Landing here with a live incident (e.g. via the toast's "Respond now") opens straight into
  // the incident tab. Arriving normally with nothing pending opens the plain terminal.
  const [view, setView] = useState<'terminal' | 'incident'>(() => (activeIncident ? 'incident' : 'terminal'))
  const [incidentNow, setIncidentNow] = useState(() => Date.now())
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyPos, setHistoryPos] = useState<number | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [editing, setEditing] = useState<{ name: string; code: string } | null>(null)

  const logEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastIncidentIdRef = useRef<string | null>(activeIncident?.id ?? null)

  function appendLog(line: string) {
    append({ kind: 'script', text: line })
  }

  const { run: runScript, stop: stopScript, running } = useScriptRunner(mutateWorld, appendLog)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'end' })
  }, [log])

  // Mirror Console progress into the site-wide XP/badge system — without this, rooting every
  // host here would be real work that the rest of the app has no way to know happened.
  const vulnClassCount = world.player.vulnClassesUsed.length
  const rootedCount = world.hosts.filter((h) => h.rootObtained && h.id !== 'home').length
  useEffect(() => {
    recordGameResult('console-classes', vulnClassCount)
  }, [vulnClassCount, recordGameResult])
  useEffect(() => {
    recordGameResult('console-roots', rootedCount)
  }, [rootedCount, recordGameResult])

  useEffect(() => {
    if (!activeIncident) return
    const id = setInterval(() => setIncidentNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [activeIncident])

  function append(entries: LogEntry | LogEntry[]) {
    setLog((prev) => [...prev, ...(Array.isArray(entries) ? entries : [entries])])
  }

  function submit() {
    const raw = input
    if (raw.trim().length === 0) return
    setHistory((h) => [...h, raw])
    setHistoryPos(null)
    setInput('')
    append({ kind: 'input', text: `[${currentHost(world).hostname}]$ ${raw}` })

    const trimmed = raw.trim()
    const lower = trimmed.toLowerCase()
    const [cmd, ...rest] = trimmed.split(/\s+/)

    if (lower === 'clear') {
      setLog(WELCOME)
      return
    }
    if (lower === 'help') {
      append({
        kind: 'system',
        text:
          'Recon: scan, net/map, nmap [-sV] <host>\n' +
          'Access: ftp <host> · curl [<host>/<path>] [-X POST] [-d "a=b&c=d"] [-H "Header: value"] · hydra -l <user> -P <wordlist> ssh://<host>\n' +
          'Sniffing: tcpdump <host> [-w file] · tshark -r <file>\n' +
          'Crafting: echo [-n] <text> [| base64 [-d]] — real pipelines, e.g. building a JWT by hand\n' +
          'Once you have access: connect/ssh <host>, then real fs commands (ls, cd, cat, grep, chmod, rm, find, sudo -l, sudo <cmd>)\n' +
          'Reference: methodology (real command examples, not answers), status, privacy, terms\n' +
          'Scripting: scripts, edit <name>, run <name>, stop',
      })
      return
    }
    if (lower === 'scripts') {
      const names = Object.keys(world.scripts)
      append({
        kind: 'system',
        text: names.length === 0 ? 'No scripts saved yet. `edit <name>` to write one.' : names.map((n) => `- ${n}`).join('\n'),
      })
      return
    }
    if (cmd === 'edit') {
      const name = rest[0]
      if (!name) {
        append({ kind: 'error', text: 'edit: specify a name, e.g. `edit myscript.js`' })
        return
      }
      setEditing({ name, code: world.scripts[name] ?? "const s = await game.status()\ngame.log('at ' + s.currentHost)\n" })
      return
    }
    if (cmd === 'run') {
      const name = rest[0]
      if (!name) {
        append({ kind: 'error', text: 'run: specify a script name, e.g. `run recon.js`' })
        return
      }
      const code = world.scripts[name]
      if (code === undefined) {
        append({ kind: 'error', text: `run: no script named "${name}" — try \`scripts\`` })
        return
      }
      runScript(name, code)
      return
    }
    if (lower === 'stop') {
      if (running) stopScript()
      else append({ kind: 'system', text: 'Nothing is running.' })
      return
    }

    let output: string[] = []
    let errorMessage: string | null = null
    mutateWorld((w) => {
      try {
        output = runConsoleCommand(raw, w)
      } catch (e) {
        errorMessage = e instanceof ConsoleError ? e.message : 'command failed'
      }
    })
    if (errorMessage) append({ kind: 'error', text: errorMessage })
    else if (output.length > 0) append(output.map((t) => ({ kind: 'output' as const, text: t })))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const pos = historyPos === null ? history.length - 1 : Math.max(0, historyPos - 1)
      setHistoryPos(pos)
      setInput(history[pos])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyPos === null) return
      const pos = historyPos + 1
      if (pos >= history.length) {
        setHistoryPos(null)
        setInput('')
      } else {
        setHistoryPos(pos)
        setInput(history[pos])
      }
    }
  }

  function saveScript() {
    if (!editing) return
    mutateWorld((w) => {
      w.scripts[editing.name] = editing.code
    })
    append({ kind: 'system', text: `Saved ${editing.name}. Run it with \`run ${editing.name}\`.` })
    setEditing(null)
  }

  const host = currentHost(world)
  const discoveredCount = world.hosts.filter((h) => h.discovered).length
  const userCount = world.hosts.filter((h) => h.userCompromised).length
  const rootCount = world.hosts.filter((h) => h.rootObtained).length

  // Remember whichever host is (or was) the active incident, mutated during render rather than
  // via an effect — so the Incident tab can still show a resolved/missed outcome after
  // activeIncident itself goes null, without an extra render pass just to update a ref value.
  if (activeIncident && activeIncident.id !== lastIncidentIdRef.current) {
    lastIncidentIdRef.current = activeIncident.id
  }
  const incidentHostId = lastIncidentIdRef.current
  const incidentHost = incidentHostId ? world.hosts.find((h) => h.id === incidentHostId) ?? null : null
  const incidentSecondsLeft = incidentHost?.incidentExpiresAt ? Math.max(0, Math.round((incidentHost.incidentExpiresAt - incidentNow) / 1000)) : 0
  const incidentMm = Math.floor(incidentSecondsLeft / 60)
  const incidentSs = String(incidentSecondsLeft % 60).padStart(2, '0')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Console</h1>
          <p className="mt-1 text-sm text-slate-400">
            A persistent world. Real historical breaches inspired the vulnerability classes here — fictionalized, no live exploit code, no real
            targets.
          </p>
        </div>
        <Link to="/games" className="text-sm text-slate-500 hover:text-slate-300">
          ← Games hub
        </Link>
      </div>

      {incidentHost && (
        <div className="mt-6 flex gap-1">
          <button
            onClick={() => setView('terminal')}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold transition-colors ${
              view === 'terminal' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setView('incident')}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold transition-colors ${
              view === 'incident' ? 'bg-rose-400/15 text-rose-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🚨 Incident: {incidentHost.hostname}
          </button>
        </div>
      )}

      {view === 'incident' && incidentHost && (
        <div
          className={`mt-2 rounded-lg border p-4 ${
            incidentHost.incidentResolved === 'pending'
              ? 'border-rose-400/40 bg-rose-400/5'
              : incidentHost.incidentResolved === 'resolved'
                ? 'border-emerald-400/40 bg-emerald-400/5'
                : 'border-amber-400/40 bg-amber-400/5'
          }`}
        >
          {incidentHost.incidentResolved === 'pending' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rose-300">🚨 Live incident on {incidentHost.hostname}</span>
                <span className="font-mono text-sm text-rose-300">
                  {incidentMm}:{incidentSs} left
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{incidentHost.banner}</p>
              <p className="mt-2 text-xs text-slate-500">
                Basic info: this is a real host in your network, same as any other — no shortcut here. Discover it
                (<code className="rounded bg-white/10 px-1">scan</code>/<code className="rounded bg-white/10 px-1">net</code> if you haven't), find and
                use the actual vulnerability to get access, then <code className="rounded bg-white/10 px-1">connect {incidentHost.hostname}</code> to
                lock it down before time runs out. The terminal below is the same one you always use.
              </p>
            </>
          ) : incidentHost.incidentResolved === 'resolved' ? (
            <p className="text-sm text-emerald-300">✅ Resolved — you got to {incidentHost.hostname} before the attacker finished.</p>
          ) : (
            <p className="text-sm text-amber-300">⌛ Missed — time ran out on {incidentHost.hostname} this time. It happens; the next one's a fresh chance.</p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div
          className="h-[500px] overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-sm thin-scroll"
          onClick={() => inputRef.current?.focus()}
        >
          {log.map((entry, i) => (
            <div key={i} className={`whitespace-pre-wrap ${colorFor[entry.kind]}`}>
              {entry.text}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2 text-slate-100">
            <span className="text-slate-500">[{host.hostname}]$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent outline-none"
            />
            {running && (
              <button onClick={() => stopScript()} className="shrink-0 rounded-md bg-rose-400/20 px-2 py-0.5 text-xs text-rose-300 hover:bg-rose-400/30">
                ■ stop script
              </button>
            )}
          </div>
          <div ref={logEndRef} />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Profile</h2>
            <dl className="mt-2 space-y-1 text-slate-300">
              <div className="flex justify-between">
                <dt>Money</dt>
                <dd>${world.player.money}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Reputation</dt>
                <dd>{world.player.rep}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Discovered</dt>
                <dd>
                  {discoveredCount}/{world.hosts.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>User access</dt>
                <dd>
                  {userCount}/{world.hosts.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Root (flags)</dt>
                <dd>
                  {rootCount}/{world.hosts.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Incidents resolved</dt>
                <dd>{world.incidentsResolved}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Incidents missed</dt>
                <dd>{world.incidentsMissed}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vulnerability classes used ({world.player.vulnClassesUsed.length}/9)
            </h2>
            {world.player.vulnClassesUsed.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">None yet — try `methodology` for real technique syntax.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-slate-300">
                {world.player.vulnClassesUsed.map((id) => (
                  <li key={id}>✓ {id}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scripts</h2>
              {running && <span className="text-[11px] text-sky-300">● running</span>}
            </div>
            <ul className="mt-2 space-y-1.5">
              {Object.keys(world.scripts).map((name) => (
                <li key={name} className="flex items-center justify-between text-slate-300">
                  <span className="truncate">{name}</span>
                  <span className="flex shrink-0 gap-2 text-xs">
                    <button onClick={() => setEditing({ name, code: world.scripts[name] })} className="text-slate-500 hover:text-slate-300">
                      edit
                    </button>
                    <button onClick={() => runScript(name, world.scripts[name])} disabled={running} className="text-emerald-400 hover:text-emerald-300 disabled:opacity-40">
                      run
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setEditing({ name: 'new-script.js', code: "game.log('hello world')\n" })}
              className="mt-3 w-full rounded-md bg-white/10 px-2 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/15"
            >
              + new script
            </button>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-xs text-slate-500">
            {confirmReset ? (
              <div className="space-y-2">
                <p>This deletes your whole network, scripts, and progress. Sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetConsole()
                      setLog(WELCOME)
                      setConfirmReset(false)
                    }}
                    className="rounded-md bg-rose-400/90 px-2 py-1 font-semibold text-black hover:bg-rose-300"
                  >
                    Yes, reset
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="rounded-md bg-white/10 px-2 py-1 text-slate-200 hover:bg-white/15">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="underline decoration-dotted hover:text-slate-300">
                reset this network
              </button>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#0a0c10] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-sm text-slate-100 outline-none focus:border-white/30"
              />
              <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-slate-300">
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Real JavaScript in a sandboxed Web Worker — no DOM, no localStorage, killable anytime. Available:{' '}
              <code className="text-slate-400">game.scan()</code>, <code className="text-slate-400">game.net()</code>,{' '}
              <code className="text-slate-400">game.nmap(host, withVersion?)</code>, <code className="text-slate-400">game.ftp(host)</code>,{' '}
              <code className="text-slate-400">game.curl(url, {'{'}method,data,header{'}'})</code>,{' '}
              <code className="text-slate-400">game.hydra(user, wordlist, host)</code>,{' '}
              <code className="text-slate-400">game.tcpdump(host, file?)</code>, <code className="text-slate-400">game.tshark(file)</code>,{' '}
              <code className="text-slate-400">game.connect(host)</code>,{' '}
              <code className="text-slate-400">game.shell(cmd)</code> (runs a real command — including base64/echo pipelines — on your connected host),{' '}
              <code className="text-slate-400">game.status()</code>, <code className="text-slate-400">game.log(...)</code>,{' '}
              <code className="text-slate-400">await game.sleep(ms)</code>.
            </p>
            <textarea
              value={editing.code}
              onChange={(e) => setEditing({ ...editing, code: e.target.value })}
              rows={16}
              spellCheck={false}
              className="mt-3 w-full rounded-md border border-white/10 bg-black/40 p-3 font-mono text-sm text-slate-200 outline-none focus:border-white/30"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md bg-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/15">
                Cancel
              </button>
              <button onClick={saveScript} className="rounded-md bg-emerald-400 px-3 py-1.5 text-sm font-semibold text-black hover:bg-emerald-300">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
