import { useState } from 'react'
import GameShell, { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import type { QuizRound } from './gameData'

interface Props {
  gameId: string
  emoji: string
  title: string
  instructions: string
  choiceLabels: [string, string]
  choiceColors: [string, string]
  rounds: QuizRound[]
  maxScore: number
}

export default function TwoChoiceQuizGame({ gameId, emoji, title, instructions, choiceLabels, choiceColors, rounds, maxScore }: Props) {
  const { recordGameResult } = useAppState()
  const [order] = useState(() => rounds)
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState<0 | 1 | null>(null)
  const [finished, setFinished] = useState(false)

  const current = order[roundIndex]

  function choose(choice: 0 | 1) {
    if (answer !== null) return
    setAnswer(choice)
    if (choice === current.correct) setScore((s) => s + 1)
  }

  function next() {
    if (roundIndex + 1 >= order.length) {
      setFinished(true)
      recordGameResult(gameId, score)
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
      <GameShell emoji={emoji} title={title} instructions={instructions}>
        <GameResult
          score={score}
          maxScore={maxScore}
          scoreUnit="correct"
          xpEarned={xpFromGameScore(score, maxScore)}
          onReplay={replay}
        />
      </GameShell>
    )
  }

  return (
    <GameShell emoji={emoji} title={title} instructions={instructions}>
      <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
        <span>
          Round {roundIndex + 1} / {order.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <p className="font-mono text-sm text-slate-200">{current.prompt}</p>
        <p className="mt-3 text-sm text-slate-400">{current.detail}</p>
      </div>

      {answer === null ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => choose(0)}
            className="rounded-md border px-4 py-3 font-semibold transition-colors"
            style={{ borderColor: `${choiceColors[0]}55`, color: choiceColors[0] }}
          >
            {choiceLabels[0]}
          </button>
          <button
            onClick={() => choose(1)}
            className="rounded-md border px-4 py-3 font-semibold transition-colors"
            style={{ borderColor: `${choiceColors[1]}55`, color: choiceColors[1] }}
          >
            {choiceLabels[1]}
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div
            className={`rounded-md border p-4 text-sm ${
              answer === current.correct ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/40 bg-rose-400/10 text-rose-200'
            }`}
          >
            <p className="font-semibold">
              {answer === current.correct ? 'Correct.' : `Not quite — the answer was "${choiceLabels[current.correct]}."`}
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
