import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { loadWorld, saveWorld, resetWorld } from '../console-sim/persistence'
import type { ConsoleWorld, HostDef } from '../console-sim/types'

const MIN_INCIDENT_GAP_MS = 90_000
const MAX_INCIDENT_GAP_MS = 240_000
const INCIDENT_DURATION_MS = 90_000

function randomGap() {
  return MIN_INCIDENT_GAP_MS + Math.random() * (MAX_INCIDENT_GAP_MS - MIN_INCIDENT_GAP_MS)
}

function pickIncidentHost(world: ConsoleWorld): HostDef | null {
  const candidates = world.hosts.filter((h) => h.id !== 'home' && !h.rootObtained && !(h.isIncident && h.incidentResolved === 'pending'))
  if (candidates.length === 0) return null
  // bias toward Easy/Medium hosts so an ambient incident is usually solvable without notice
  const easier = candidates.filter((h) => h.difficulty !== 'Hard')
  const pool = easier.length > 0 ? easier : candidates
  return pool[Math.floor(Math.random() * pool.length)]
}

interface ConsoleWorldValue {
  world: ConsoleWorld
  mutateWorld: (mutator: (w: ConsoleWorld) => void) => void
  resetConsole: () => void
  activeIncident: HostDef | null
  toastDismissed: boolean
  dismissToast: () => void
}

const ConsoleWorldContext = createContext<ConsoleWorldValue | null>(null)

export function ConsoleWorldProvider({ children }: { children: ReactNode }) {
  // worldRef is the single canonical, mutable copy (commands mutate it directly and exactly
  // once per call). `snapshot` is a plain React state value kept in sync after each mutation —
  // every render and every consumer reads from `snapshot`, never from the ref, and nothing here
  // relies on React's setState-updater form (which StrictMode double-invokes to catch impure
  // reducers — our mutations are deliberately impure, so we sidestep that path entirely).
  const worldRef = useRef<ConsoleWorld>(loadWorld())
  const [snapshot, setSnapshot] = useState<ConsoleWorld>(worldRef.current)
  const [toastDismissed, setToastDismissed] = useState(false)
  const nextIncidentAt = useRef<number>(Date.now() + randomGap())

  useEffect(() => {
    saveWorld(snapshot)
  }, [snapshot])

  function mutateWorld(mutator: (w: ConsoleWorld) => void) {
    mutator(worldRef.current)
    const next = { ...worldRef.current }
    worldRef.current = next
    setSnapshot(next)
  }

  useEffect(() => {
    const id = setInterval(() => {
      mutateWorld((w) => {
        const pending = w.hosts.find((h) => h.isIncident && h.incidentResolved === 'pending')
        if (pending && pending.incidentExpiresAt && Date.now() > pending.incidentExpiresAt) {
          pending.incidentResolved = 'missed'
          w.incidentsMissed += 1
        }
        const stillPending = w.hosts.some((h) => h.isIncident && h.incidentResolved === 'pending')
        if (!stillPending && Date.now() >= nextIncidentAt.current) {
          const target = pickIncidentHost(w)
          if (target) {
            target.discovered = true
            target.isIncident = true
            target.incidentResolved = 'pending'
            target.incidentExpiresAt = Date.now() + INCIDENT_DURATION_MS
            setToastDismissed(false)
          }
          nextIncidentAt.current = Date.now() + randomGap()
        }
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetConsole() {
    const fresh = resetWorld()
    worldRef.current = fresh
    setSnapshot(fresh)
    nextIncidentAt.current = Date.now() + randomGap()
    setToastDismissed(false)
  }

  const activeIncident = snapshot.hosts.find((h) => h.isIncident && h.incidentResolved === 'pending') ?? null

  return (
    <ConsoleWorldContext.Provider
      value={{ world: snapshot, mutateWorld, resetConsole, activeIncident, toastDismissed, dismissToast: () => setToastDismissed(true) }}
    >
      {children}
    </ConsoleWorldContext.Provider>
  )
}

export function useConsoleWorld() {
  const ctx = useContext(ConsoleWorldContext)
  if (!ctx) throw new Error('useConsoleWorld must be used within ConsoleWorldProvider')
  return ctx
}
