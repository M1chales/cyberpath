import { useRef, useState } from 'react'
import { handleScriptAction } from './scriptBridge'
import type { ConsoleWorld } from './types'

const MAX_ACTIONS = 500
const MAX_WALLCLOCK_MS = 60_000

export function useScriptRunner(mutateWorld: (mutator: (w: ConsoleWorld) => void) => void, onLog: (line: string) => void) {
  const workerRef = useRef<Worker | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [running, setRunning] = useState(false)

  function cleanup() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    workerRef.current = null
    setRunning(false)
  }

  function stop(reason?: string) {
    workerRef.current?.terminate()
    cleanup()
    onLog(reason ? `[script stopped: ${reason}]` : '[script stopped]')
  }

  function run(name: string, code: string) {
    if (workerRef.current) {
      onLog('A script is already running — stop it first.')
      return
    }
    if (code.trim().length === 0) {
      onLog(`[${name} is empty]`)
      return
    }

    const worker = new Worker(new URL('./scriptWorker.ts', import.meta.url), { type: 'module' })
    workerRef.current = worker
    setRunning(true)
    onLog(`[running ${name} in a sandboxed worker — no DOM access, no localStorage access, killable anytime]`)

    let actionCount = 0
    const startedAt = Date.now()
    timeoutRef.current = setTimeout(() => stop('exceeded 60s time limit'), MAX_WALLCLOCK_MS)

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data
      if (msg.type === 'action') {
        actionCount++
        if (actionCount > MAX_ACTIONS) {
          stop('exceeded 500 action limit')
          return
        }
        let ok = true
        let value: unknown
        let error = ''
        mutateWorld((w) => {
          try {
            value = handleScriptAction(msg.method, msg.args, w)
          } catch (err) {
            ok = false
            error = err instanceof Error ? err.message : String(err)
          }
        })
        worker.postMessage({ type: 'result', id: msg.id, ok, value, error })
      } else if (msg.type === 'log') {
        onLog(`[${name}] ${msg.text}`)
      } else if (msg.type === 'done') {
        onLog(`[${name} finished — ${actionCount} action(s), ${((Date.now() - startedAt) / 1000).toFixed(1)}s]`)
        worker.terminate()
        cleanup()
      } else if (msg.type === 'error') {
        onLog(`[${name} error] ${msg.message}`)
        worker.terminate()
        cleanup()
      }
    }
    worker.onerror = (e) => {
      onLog(`[${name} crashed] ${e.message}`)
      worker.terminate()
      cleanup()
    }
    worker.postMessage({ type: 'start', code })
  }

  return { run, stop, running }
}
