import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  emoji: string
  title: string
  instructions: string
  children: ReactNode
}

export default function GameShell({ emoji, title, instructions, children }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link to="/games" className="text-sm text-slate-500 hover:text-slate-300">
        ← Back to games
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      <p className="mt-2 text-sm text-slate-400">{instructions}</p>
      <div className="mt-8">{children}</div>
    </div>
  )
}

export function GameResult({
  score,
  maxScore,
  scoreUnit,
  xpEarned,
  onReplay,
}: {
  score: number
  maxScore: number
  scoreUnit: string
  xpEarned: number
  onReplay: () => void
}) {
  const percent = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100)
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
      <div className="font-mono text-4xl font-bold text-emerald-300">
        {score}/{maxScore}
      </div>
      <p className="mt-1 text-sm text-slate-400">
        {scoreUnit} · {percent}%
      </p>
      <p className="mt-3 text-sm text-slate-300">+{xpEarned} XP earned toward your rank (best score counts)</p>
      <button
        onClick={onReplay}
        className="mt-5 rounded-md bg-emerald-400 px-5 py-2 font-semibold text-black transition-colors hover:bg-emerald-300"
      >
        Play again
      </button>
      <Link to="/progress" className="mt-3 block text-sm text-slate-500 hover:text-slate-300">
        View your overall progress →
      </Link>
    </div>
  )
}
