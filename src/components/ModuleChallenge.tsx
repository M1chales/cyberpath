import { useState } from 'react'
import type { Challenge } from '../data/challenges/types'
import { xpFromChallengeRating } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'

const RATINGS = [
  { value: 0, label: 'Need to revisit', color: '#fb7185' },
  { value: 1, label: 'Partially got it', color: '#facc15' },
  { value: 2, label: 'Nailed it', color: '#34d399' },
]

export default function ModuleChallenge({ moduleId, challenge, accent = '#34d399' }: { moduleId: string; challenge: Challenge; accent?: string }) {
  const { challengeBest, recordChallengeResult } = useAppState()
  const [attempt, setAttempt] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [rated, setRated] = useState<number | null>(null)

  const best = challengeBest[moduleId]

  function rate(value: number) {
    setRated(value)
    recordChallengeResult(moduleId, value)
  }

  function retry() {
    setAttempt('')
    setRevealed(false)
    setRated(null)
  }

  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Challenge: apply it</h2>
        {best !== undefined && (
          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            best: {RATINGS[best].label}
          </span>
        )}
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{challenge.scenario}</p>
      <p className="mt-2 text-[15px] font-medium text-slate-100">{challenge.task}</p>

      {!revealed ? (
        <>
          <textarea
            value={attempt}
            onChange={(e) => setAttempt(e.target.value)}
            placeholder="Write your actual answer here before revealing the model answer — this is where the learning happens, not in reading the model answer."
            rows={5}
            className="mt-4 w-full rounded-md border border-white/15 bg-white/[0.03] p-3 text-sm text-slate-200 outline-none focus:border-white/30"
          />
          <button
            onClick={() => setRevealed(true)}
            className="mt-3 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/15"
          >
            Reveal model answer
          </button>
        </>
      ) : (
        <>
          {attempt.trim().length > 0 && (
            <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Your answer</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">{attempt}</p>
            </div>
          )}
          <div className="mt-4 rounded-md border p-4" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0d` }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
              Model answer
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
              {challenge.modelAnswer.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {challenge.stretchGoal && (
              <p className="mt-3 text-sm text-slate-400">
                <span className="font-semibold text-slate-300">Stretch goal: </span>
                {challenge.stretchGoal}
              </p>
            )}
          </div>

          {rated === null ? (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Compare your answer honestly, then rate yourself:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => rate(r.value)}
                    className="rounded-md border px-3 py-2 text-sm font-medium transition-colors"
                    style={{ borderColor: `${r.color}55`, color: r.color }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3 text-center">
              <p className="text-sm text-slate-300">
                Self-rated: <strong>{RATINGS[rated].label}</strong> — +{xpFromChallengeRating(rated)} XP (best rating counts)
              </p>
              <button onClick={retry} className="mt-2 text-xs text-slate-500 underline decoration-dotted hover:text-slate-300">
                try a different scenario approach
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
