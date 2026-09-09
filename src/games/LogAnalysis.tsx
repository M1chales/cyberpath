import { useState } from 'react'
import GameShell, { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { LOG_ANALYSIS_ROUNDS } from './gameData'

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const MAX_SCORE = LOG_ANALYSIS_ROUNDS.length

export default function LogAnalysis() {
  const { recordGameResult } = useAppState()
  const [order] = useState(() => shuffled(LOG_ANALYSIS_ROUNDS))
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const current = order[roundIndex]

  function choose(i: number) {
    if (answer !== null) return
    setAnswer(i)
    if (i === current.correct) setScore((s) => s + 1)
  }

  function next() {
    if (roundIndex + 1 >= order.length) {
      setFinished(true)
      recordGameResult('log-analysis', score)
      return
    }
    setRoundIndex((i) => i + 1)
    setAnswer(null)
  }

  function replay() {
    setRoundIndex(0)
    setScore(0)
    setAnswer(null)
    setFinished(false)
  }

  if (finished) {
    return (
      <GameShell emoji="📋" title="Log Analysis" instructions="Read the raw log, decide what actually happened.">
        <GameResult score={score} maxScore={MAX_SCORE} scoreUnit="correct" xpEarned={xpFromGameScore(score, MAX_SCORE)} onReplay={replay} />
      </GameShell>
    )
  }

  return (
    <GameShell emoji="📋" title="Log Analysis" instructions="Read the raw log, decide what actually happened.">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
        <span>
          Round {roundIndex + 1} / {order.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/40 p-4">
        <p className="font-mono text-xs text-slate-500">{current.source}</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">{current.log}</pre>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-100">{current.question}</p>

      {answer === null ? (
        <div className="mt-3 space-y-2">
          {current.choices.map((choice, i) => (
            <button
              key={choice}
              onClick={() => choose(i)}
              className="block w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <div
            className={`rounded-md border p-4 text-sm ${
              answer === current.correct ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/40 bg-rose-400/10 text-rose-200'
            }`}
          >
            <p className="font-semibold">
              {answer === current.correct ? 'Correct.' : `Not quite — the answer was "${current.choices[current.correct]}."`}
            </p>
            <p className="mt-1 text-slate-300">{current.explanation}</p>
          </div>
          <button
            onClick={next}
            className="mt-4 w-full rounded-md bg-emerald-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-emerald-300"
          >
            {roundIndex + 1 >= order.length ? 'See results' : 'Next round'}
          </button>
        </div>
      )}
    </GameShell>
  )
}
