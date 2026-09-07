// This file runs inside a real Web Worker: its own thread, its own global scope, no DOM,
// no access to localStorage/sessionStorage, and no access to anything in the main page's
// memory. The only way it can affect the game world is by asking the main thread to do it,
// one message at a time, through the `game` object below — every call is a round trip that
// the main thread validates against the real, already-tested command logic.

interface PendingEntry {
  resolve: (v: unknown) => void
  reject: (e: Error) => void
}

let nextId = 0
const pending = new Map<number, PendingEntry>()

function call(method: string, ...args: unknown[]): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = nextId++
    pending.set(id, { resolve, reject })
    postMessage({ type: 'action', id, method, args })
  })
}

interface GameApi {
  scan: () => Promise<unknown>
  net: () => Promise<unknown>
  nmap: (host: string, withVersion?: boolean) => Promise<unknown>
  ftp: (host: string) => Promise<unknown>
  curl: (url: string, opts?: { method?: string; data?: string; header?: string }) => Promise<unknown>
  hydra: (user: string, wordlist: string, target: string) => Promise<unknown>
  tcpdump: (target: string, outFile?: string) => Promise<unknown>
  tshark: (file: string) => Promise<unknown>
  connect: (host: string) => Promise<unknown>
  methodology: () => Promise<unknown>
  shell: (command: string) => Promise<unknown>
  status: () => Promise<unknown>
  log: (...args: unknown[]) => void
  sleep: (ms: number) => Promise<void>
}

const game: GameApi = {
  scan: () => call('scan'),
  net: () => call('net'),
  nmap: (host, withVersion) => call('nmap', host, withVersion),
  ftp: (host) => call('ftp', host),
  curl: (url, opts) => call('curl', url, opts),
  hydra: (user, wordlist, target) => call('hydra', user, wordlist, target),
  tcpdump: (target, outFile) => call('tcpdump', target, outFile),
  tshark: (file) => call('tshark', file),
  connect: (host) => call('connect', host),
  methodology: () => call('methodology'),
  shell: (command) => call('shell', command),
  status: () => call('status'),
  log: (...args) => postMessage({ type: 'log', text: args.map(String).join(' ') }),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, Math.min(Math.max(ms, 0), 5000))),
}

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data
  if (msg.type === 'result') {
    const p = pending.get(msg.id)
    if (!p) return
    pending.delete(msg.id)
    if (msg.ok) p.resolve(msg.value)
    else p.reject(new Error(msg.error))
    return
  }
  if (msg.type === 'start') {
    try {
      // The only thing this function closes over is `game` — no access to any outer
      // variable, no access to `self`/`postMessage` directly, no way to reach the page.
      // eslint-disable-next-line no-new-func
      const runScript = new Function('game', `return (async () => {\n${msg.code}\n})()`) as (g: GameApi) => Promise<void>
      await runScript(game)
      postMessage({ type: 'done' })
    } catch (err) {
      postMessage({ type: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }
}
