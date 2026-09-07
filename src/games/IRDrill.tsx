import { useState } from 'react'
import GameShell, { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { IR_PHASES, IR_SCENARIOS } from './gameData'

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const MAX_SCORE = IR_PHASES.length

export default function IRDrill() {
  const { recordGameResult } = useAppState()
  const [scenario, setScenario] = useState(() => IR_SCENARIOS[Math.floor(Math.random() * IR_SCENARIOS.length)])
  const [pool, setPool] = useState(() => shuffled(IR_PHASES))

  const [chosen, setChosen] = useState<typeof IR_PHASES>([])
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const remaining = pool.filter((p) => !chosen.some((c) => c.id === p.id))

  function pick(phase: (typeof IR_PHASES)[number]) {
    if (finished) return
    const next = [...chosen, phase]
    setChosen(next)
    if (next.length === IR_PHASES.length) {
      const correctCount = next.filter((p, i) => p.id === IR_PHASES[i].id).length
      setScore(correctCount)
      setFinished(true)
      recordGameResult('ir-drill', correctCount)
    }
  }

  function replay() {
    setChosen([])
    setFinished(false)
    setScore(0)
    setScenario(IR_SCENARIOS[Math.floor(Math.random() * IR_SCENARIOS.length)])
    setPool(shuffled(IR_PHASES))
  }

  if (finished) {
    return (
      <GameShell emoji="🚨" title="Incident Response Drill" instructions={scenario.description}>
        <div className="mb-5 space-y-2">
          {chosen.map((p, i) => {
            const correct = p.id === IR_PHASES[i].id
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                  correct ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/40 bg-rose-400/10 text-rose-200'
                }`}
              >
                <span>
                  {i + 1}. {p.label}
                </span>
                <span>{correct ? '✓ correct spot' : `should be #${IR_PHASES.findIndex((x) => x.id === p.id) + 1}`}</span>
              </div>
            )
          })}
        </div>
        <GameResult score={score} maxScore={MAX_SCORE} scoreUnit="phases in the right order" xpEarned={xpFromGameScore(score, MAX_SCORE)} onReplay={replay} />
      </GameShell>
    )
  }

  return (
    <GameShell emoji="🚨" title="Incident Response Drill" instructions={scenario.description}>
      <p className="mb-4 text-sm text-slate-400">
        Click the phases below in the order the NIST incident response lifecycle actually runs, starting from what
        should happen first.
      </p>

      {chosen.length > 0 && (
        <div className="mb-4 space-y-1">
          {chosen.map((p, i) => (
            <div key={p.id} className="rounded-md border border-emerald-400/30 bg-emerald-400/5 px-3 py-1.5 text-sm text-emerald-200">
              {i + 1}. {p.label}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {remaining.map((phase) => (
          <button
            key={phase.id}
            onClick={() => pick(phase)}
            className="rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
          >
            <div className="font-semibold">{phase.label}</div>
            <div className="mt-1 text-xs text-slate-500">{phase.hint}</div>
          </button>
        ))}
      </div>
    </GameShell>
  )
}
