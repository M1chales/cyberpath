import { useState } from 'react'
import GameShell, { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { ALL_DEFENSES, DEFENSE_BUDGET, KILL_CHAIN_STAGES, TOTAL_STAGES } from './breachData'

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomSubset(ids: string[], count: number): Set<string> {
  return new Set(shuffled(ids).slice(0, count))
}

interface StageResult {
  stageId: string
  stageLabel: string
  outcome: 'blocked' | 'breached' | 'secured'
  usedTechnique?: { attackName: string; defenseName: string }
}

export default function BreachSimulatorEngine({ mode }: { mode: 'defend' | 'attack' }) {
  const { recordGameResult } = useAppState()
  const gameId = mode === 'defend' ? 'breach-defend' : 'breach-attack'

  // --- Defend mode state ---
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [defendPhase, setDefendPhase] = useState<'select' | 'done'>('select')
  const [defendResults, setDefendResults] = useState<StageResult[]>([])
  const [revealCount, setRevealCount] = useState(0)

  // --- Attack mode state ---
  const [hiddenDefended, setHiddenDefended] = useState(() => randomSubset(ALL_DEFENSES.map((d) => d.id), DEFENSE_BUDGET))
  const [attackStageIndex, setAttackStageIndex] = useState(0)
  const [attemptedInStage, setAttemptedInStage] = useState<Set<string>>(new Set())
  const [attackResults, setAttackResults] = useState<StageResult[]>([])
  const [attackPhase, setAttackPhase] = useState<'playing' | 'done'>('playing')

  function toggleDefense(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < DEFENSE_BUDGET) next.add(id)
      return next
    })
  }

  function runDefendSimulation() {
    const results: StageResult[] = []
    let chainBroken = false
    for (const stage of KILL_CHAIN_STAGES) {
      if (chainBroken) {
        results.push({ stageId: stage.id, stageLabel: stage.label, outcome: 'secured' })
        continue
      }
      const undefended = stage.options.filter((o) => !selected.has(o.id))
      if (undefended.length === 0) {
        results.push({ stageId: stage.id, stageLabel: stage.label, outcome: 'blocked' })
        chainBroken = true
      } else {
        const used = undefended[Math.floor(Math.random() * undefended.length)]
        results.push({
          stageId: stage.id,
          stageLabel: stage.label,
          outcome: 'breached',
          usedTechnique: { attackName: used.attackName, defenseName: used.defenseName },
        })
      }
    }
    setDefendResults(results)
    setDefendPhase('done')
    setRevealCount(1)
    const score = results.filter((r) => r.outcome !== 'breached').length
    recordGameResult(gameId, score)
  }

  function finishAttack(finalResults: StageResult[]) {
    setAttackResults(finalResults)
    setAttackPhase('done')
    const score = finalResults.filter((r) => r.outcome === 'breached').length
    recordGameResult(gameId, score)
  }

  function attemptTechnique(techniqueId: string) {
    const stage = KILL_CHAIN_STAGES[attackStageIndex]
    const option = stage.options.find((o) => o.id === techniqueId)!
    const isDefended = hiddenDefended.has(techniqueId)

    if (!isDefended) {
      const newResult: StageResult = {
        stageId: stage.id,
        stageLabel: stage.label,
        outcome: 'breached',
        usedTechnique: { attackName: option.attackName, defenseName: option.defenseName },
      }
      const updatedResults = [...attackResults, newResult]
      if (attackStageIndex + 1 >= TOTAL_STAGES) {
        finishAttack(updatedResults)
      } else {
        setAttackResults(updatedResults)
        setAttackStageIndex((i) => i + 1)
        setAttemptedInStage(new Set())
      }
      return
    }

    const nextAttempted = new Set(attemptedInStage)
    nextAttempted.add(techniqueId)
    if (nextAttempted.size >= stage.options.length) {
      finishAttack([...attackResults, { stageId: stage.id, stageLabel: stage.label, outcome: 'blocked' }])
    } else {
      setAttemptedInStage(nextAttempted)
    }
  }

  function replay() {
    setHiddenDefended(randomSubset(ALL_DEFENSES.map((d) => d.id), DEFENSE_BUDGET))
    setSelected(new Set())
    setDefendPhase('select')
    setDefendResults([])
    setRevealCount(0)
    setAttackStageIndex(0)
    setAttemptedInStage(new Set())
    setAttackResults([])
    setAttackPhase('playing')
  }

  const outcomeStyle = (outcome: StageResult['outcome']) =>
    outcome === 'breached'
      ? 'border-rose-400/40 bg-rose-400/10 text-rose-200'
      : outcome === 'blocked'
        ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
        : 'border-sky-400/30 bg-sky-400/5 text-sky-200'

  if (mode === 'defend') {
    if (defendPhase === 'select') {
      return (
        <GameShell
          emoji="🛡️"
          title="Breach Simulator: Defend the Network"
          instructions={`You have a budget of ${DEFENSE_BUDGET} defenses out of ${ALL_DEFENSES.length} available. Pick wisely — an attacker will try every stage of the kill chain, in order, looking for anything you left uncovered. This is a simplified model for building technique-to-mitigation recall, not a real network.`}
        >
          <p className="mb-3 text-sm text-slate-400">
            Selected: {selected.size}/{DEFENSE_BUDGET}
          </p>
          <div className="space-y-5">
            {KILL_CHAIN_STAGES.map((stage) => (
              <div key={stage.id}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stage.label}</h3>
                <div className="mt-2 space-y-2">
                  {stage.options.map((o) => {
                    const isSelected = selected.has(o.id)
                    const disabled = !isSelected && selected.size >= DEFENSE_BUDGET
                    return (
                      <button
                        key={o.id}
                        onClick={() => toggleDefense(o.id)}
                        disabled={disabled}
                        className={`block w-full rounded-md border p-3 text-left text-sm transition-colors ${
                          isSelected
                            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                            : disabled
                              ? 'cursor-not-allowed border-white/5 bg-white/[0.01] text-slate-600'
                              : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25'
                        }`}
                      >
                        <div className="font-medium">{o.defenseName}</div>
                        <div className="mt-0.5 text-xs text-slate-500">counters: {o.attackName}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={runDefendSimulation}
            disabled={selected.size === 0}
            className="mt-6 w-full rounded-md bg-emerald-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Deploy & run the simulation
          </button>
        </GameShell>
      )
    }

    const visible = defendResults.slice(0, revealCount)
    const done = revealCount >= defendResults.length
    const score = defendResults.filter((r) => r.outcome !== 'breached').length

    return (
      <GameShell emoji="🛡️" title="Breach Simulator: Defend the Network" instructions="The attacker moves through the kill chain, stage by stage.">
        <div className="space-y-3">
          {visible.map((r) => (
            <div key={r.stageId} className={`rounded-md border p-3 text-sm ${outcomeStyle(r.outcome)}`}>
              <div className="font-semibold">{r.stageLabel}</div>
              {r.outcome === 'breached' && r.usedTechnique && (
                <p className="mt-1">
                  🔓 Breached via <strong>{r.usedTechnique.attackName}</strong> — you hadn't deployed "{r.usedTechnique.defenseName}."
                </p>
              )}
              {r.outcome === 'blocked' && <p className="mt-1">🛡️ Every technique here was covered. The chain breaks — the attacker never reaches the next stage.</p>}
              {r.outcome === 'secured' && <p className="mt-1">✅ Never reached — the chain was already broken upstream.</p>}
            </div>
          ))}
        </div>
        {!done ? (
          <button
            onClick={() => setRevealCount((c) => c + 1)}
            className="mt-4 w-full rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/15"
          >
            Next stage →
          </button>
        ) : (
          <GameResult score={score} maxScore={TOTAL_STAGES} scoreUnit="stages secured" xpEarned={xpFromGameScore(score, TOTAL_STAGES)} onReplay={replay} />
        )}
      </GameShell>
    )
  }

  // --- attack mode render ---
  if (attackPhase === 'done') {
    const score = attackResults.filter((r) => r.outcome === 'breached').length
    return (
      <GameShell emoji="💥" title="Breach Simulator: Find the Gap" instructions="Debrief: here's the network's actual defense map.">
        <div className="space-y-3">
          {attackResults.map((r) => (
            <div key={r.stageId} className={`rounded-md border p-3 text-sm ${outcomeStyle(r.outcome)}`}>
              <div className="font-semibold">{r.stageLabel}</div>
              {r.outcome === 'breached' && r.usedTechnique && (
                <p className="mt-1">
                  🔓 You got through with <strong>{r.usedTechnique.attackName}</strong> — "{r.usedTechnique.defenseName}" wasn't deployed here.
                </p>
              )}
              {r.outcome === 'blocked' && <p className="mt-1">🛡️ Every technique you tried here was already covered. Stopped.</p>}
            </div>
          ))}
        </div>
        <GameResult score={score} maxScore={TOTAL_STAGES} scoreUnit="stages breached" xpEarned={xpFromGameScore(score, TOTAL_STAGES)} onReplay={replay} />
      </GameShell>
    )
  }

  const currentStage = KILL_CHAIN_STAGES[attackStageIndex]

  return (
    <GameShell
      emoji="💥"
      title="Breach Simulator: Find the Gap"
      instructions="A network has randomly deployed some (not all) of the available defenses, hidden from you. Try techniques stage by stage — an undefended one gets you through; a defended one is burned. This is a simplified model for building technique recall, not real attack guidance."
    >
      <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
        <span>
          Stage {attackStageIndex + 1}/{TOTAL_STAGES}: {currentStage.label}
        </span>
        <span>Breached so far: {attackResults.filter((r) => r.outcome === 'breached').length}</span>
      </div>
      <div className="space-y-2">
        {currentStage.options.map((o) => {
          const tried = attemptedInStage.has(o.id)
          return (
            <button
              key={o.id}
              onClick={() => attemptTechnique(o.id)}
              disabled={tried}
              className={`block w-full rounded-md border p-3 text-left text-sm transition-colors ${
                tried
                  ? 'cursor-not-allowed border-rose-400/30 bg-rose-400/5 text-rose-300/60 line-through'
                  : 'border-white/10 bg-white/[0.02] text-slate-200 hover:border-white/25'
              }`}
            >
              <div className="font-medium">{o.attackName}</div>
              <div className="mt-0.5 text-xs text-slate-500">{o.attackFlavor}</div>
              {tried && <div className="mt-1 text-xs text-rose-400">blocked — defense was already in place</div>}
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
