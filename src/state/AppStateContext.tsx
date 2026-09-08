import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TOTAL_WEEKS } from '../data/curriculum'
import { TOTAL_MASTERY_MODULES } from '../data/masteryTrack'
import { computeBadges, computeXp } from '../lib/gamification'

export const APP_STORAGE_KEY = 'cyberpath.state.v4'
const STORAGE_KEY = APP_STORAGE_KEY
const LEGACY_V3_KEY = 'cyberpath.state.v3'
const LEGACY_V2_KEY = 'cyberpath.state.v2'
const LEGACY_CORE_KEY = 'cyberpath.completedModules.v1'

interface StoredState {
  core: string[]
  mastery: string[]
  gameBest: Record<string, number>
  gamePlays: Record<string, number>
  quizBest: Record<string, number>
  challengeBest: Record<string, number>
  streak: { current: number; longest: number; lastActive: string | null }
}

function emptyState(): StoredState {
  return {
    core: [],
    mastery: [],
    gameBest: {},
    gamePlays: {},
    quizBest: {},
    challengeBest: {},
    streak: { current: 0, longest: 0, lastActive: null },
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function loadInitial(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        core: Array.isArray(parsed.core) ? parsed.core : [],
        mastery: Array.isArray(parsed.mastery) ? parsed.mastery : [],
        gameBest: parsed.gameBest ?? {},
        gamePlays: parsed.gamePlays ?? {},
        quizBest: parsed.quizBest ?? {},
        challengeBest: parsed.challengeBest ?? {},
        streak: parsed.streak ?? { current: 0, longest: 0, lastActive: null },
      }
    }
    // migrate from the pre-challenge storage key if present
    const v3Raw = localStorage.getItem(LEGACY_V3_KEY)
    if (v3Raw) {
      const parsed = JSON.parse(v3Raw)
      return {
        core: Array.isArray(parsed.core) ? parsed.core : [],
        mastery: Array.isArray(parsed.mastery) ? parsed.mastery : [],
        gameBest: parsed.gameBest ?? {},
        gamePlays: parsed.gamePlays ?? {},
        quizBest: parsed.quizBest ?? {},
        challengeBest: {},
        streak: parsed.streak ?? { current: 0, longest: 0, lastActive: null },
      }
    }
    // migrate from the pre-quiz storage key if present
    const v2Raw = localStorage.getItem(LEGACY_V2_KEY)
    if (v2Raw) {
      const parsed = JSON.parse(v2Raw)
      return {
        ...emptyState(),
        core: Array.isArray(parsed.core) ? parsed.core : [],
        mastery: Array.isArray(parsed.mastery) ? parsed.mastery : [],
        gameBest: parsed.gameBest ?? {},
        gamePlays: parsed.gamePlays ?? {},
        streak: parsed.streak ?? { current: 0, longest: 0, lastActive: null },
      }
    }
    // migrate from the original pre-gamification storage key if present
    const legacyRaw = localStorage.getItem(LEGACY_CORE_KEY)
    const legacyCore = legacyRaw ? JSON.parse(legacyRaw) : []
    return { ...emptyState(), core: Array.isArray(legacyCore) ? legacyCore : [] }
  } catch {
    return emptyState()
  }
}

function bumpStreak(streak: StoredState['streak']): StoredState['streak'] {
  const today = todayStr()
  if (streak.lastActive === today) return streak
  const wasYesterday = streak.lastActive === yesterdayStr()
  const current = wasYesterday ? streak.current + 1 : 1
  return { current, longest: Math.max(streak.longest, current), lastActive: today }
}

interface AppStateValue {
  core: Set<string>
  mastery: Set<string>
  gameBest: Record<string, number>
  gamePlays: Record<string, number>
  quizBest: Record<string, number>
  challengeBest: Record<string, number>
  streak: { current: number; longest: number; lastActive: string | null }
  toggleCore: (id: string) => void
  toggleMastery: (id: string) => void
  recordGameResult: (gameId: string, score: number) => void
  recordQuizResult: (moduleId: string, score: number) => void
  recordChallengeResult: (moduleId: string, rating: number) => void
  resetCore: () => void
  resetMastery: () => void
  resetAll: () => void
  xp: ReturnType<typeof computeXp>
  badges: ReturnType<typeof computeBadges>
  coreProgress: { count: number; total: number; percent: number }
  masteryProgress: { count: number; total: number; percent: number }
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(() => {
    const initial = loadInitial()
    return { ...initial, streak: bumpStreak(initial.streak) }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable (private mode, etc.) - progress just won't persist
    }
  }, [state])

  const toggleCore = (id: string) =>
    setState((prev) => {
      const next = new Set(prev.core)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, core: Array.from(next) }
    })

  const toggleMastery = (id: string) =>
    setState((prev) => {
      const next = new Set(prev.mastery)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, mastery: Array.from(next) }
    })

  const recordGameResult = (gameId: string, score: number) =>
    setState((prev) => ({
      ...prev,
      gameBest: { ...prev.gameBest, [gameId]: Math.max(prev.gameBest[gameId] ?? 0, score) },
      gamePlays: { ...prev.gamePlays, [gameId]: (prev.gamePlays[gameId] ?? 0) + 1 },
    }))

  const recordQuizResult = (moduleId: string, score: number) =>
    setState((prev) => ({
      ...prev,
      quizBest: { ...prev.quizBest, [moduleId]: Math.max(prev.quizBest[moduleId] ?? 0, score) },
    }))

  const recordChallengeResult = (moduleId: string, rating: number) =>
    setState((prev) => ({
      ...prev,
      challengeBest: { ...prev.challengeBest, [moduleId]: Math.max(prev.challengeBest[moduleId] ?? 0, rating) },
    }))

  const resetCore = () => setState((prev) => ({ ...prev, core: [] }))
  const resetMastery = () => setState((prev) => ({ ...prev, mastery: [] }))
  const resetAll = () => setState(emptyState())

  const coreSet = useMemo(() => new Set(state.core), [state.core])
  const masterySet = useMemo(() => new Set(state.mastery), [state.mastery])

  const xp = useMemo(
    () => computeXp(coreSet, masterySet, state.gameBest, state.quizBest, state.challengeBest),
    [coreSet, masterySet, state.gameBest, state.quizBest, state.challengeBest],
  )
  const badges = useMemo(
    () => computeBadges(coreSet, masterySet, state.gameBest, state.gamePlays, state.quizBest, state.challengeBest, state.streak.longest),
    [coreSet, masterySet, state.gameBest, state.gamePlays, state.quizBest, state.challengeBest, state.streak.longest],
  )

  const value: AppStateValue = {
    core: coreSet,
    mastery: masterySet,
    gameBest: state.gameBest,
    gamePlays: state.gamePlays,
    quizBest: state.quizBest,
    challengeBest: state.challengeBest,
    streak: state.streak,
    toggleCore,
    toggleMastery,
    recordGameResult,
    recordQuizResult,
    recordChallengeResult,
    resetCore,
    resetMastery,
    resetAll,
    xp,
    badges,
    coreProgress: {
      count: coreSet.size,
      total: TOTAL_WEEKS,
      percent: TOTAL_WEEKS === 0 ? 0 : Math.round((coreSet.size / TOTAL_WEEKS) * 100),
    },
    masteryProgress: {
      count: masterySet.size,
      total: TOTAL_MASTERY_MODULES,
      percent: TOTAL_MASTERY_MODULES === 0 ? 0 : Math.round((masterySet.size / TOTAL_MASTERY_MODULES) * 100),
    },
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
