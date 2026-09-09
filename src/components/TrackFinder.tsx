import { useState } from 'react'
import { TRACK_FINDER_QUESTIONS } from '../data/trackFinder'
import { useAppState } from '../state/AppStateContext'

function scoreAnswers(answers: string[]): string {
  const tally: Record<string, number> = {}
  for (const trackId of answers) tally[trackId] = (tally[trackId] ?? 0) + 1
  let best = answers[0]
  let bestScore = -1
  // Walk answers in the order the questions were asked, so on a tie the track from an earlier
  // answer wins — deterministic, rather than depending on object key insertion order accidents.
  for (const trackId of answers) {
    if (tally[trackId] > bestScore) {
      bestScore = tally[trackId]
      best = trackId
    }
  }
  return best
}

export default function TrackFinder({ onDone }: { onDone: () => void }) {
  const { setPreferredTrack } = useAppState()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const question = TRACK_FINDER_QUESTIONS[step]

  function pick(trackId: string) {
    const next = [...answers, trackId]
    if (step + 1 >= TRACK_FINDER_QUESTIONS.length) {
      setPreferredTrack(scoreAnswers(next))
      onDone()
      return
    }
    setAnswers(next)
    setStep((s) => s + 1)
  }

  return (
    <div className="rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/5 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-fuchsia-300">
          Find your track — question {step + 1}/{TRACK_FINDER_QUESTIONS.length}
        </span>
        <button onClick={onDone} className="text-xs text-slate-500 hover:text-slate-300">
          cancel
        </button>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-100">{question.question}</p>
      <div className="mt-3 space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.trackId}
            onClick={() => pick(opt.trackId)}
            className="block w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-left text-sm text-slate-200 transition-colors hover:border-fuchsia-400/30 hover:bg-fuchsia-400/10"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
