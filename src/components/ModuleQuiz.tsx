import { useState } from 'react'
import type { QuizQuestion } from '../data/quizzes/types'
import { xpFromQuizScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'

export default function ModuleQuiz({ moduleId, questions, accent = '#34d399' }: { moduleId: string; questions: QuizQuestion[]; accent?: string }) {
  const { quizBest, recordQuizResult } = useAppState()
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [recorded, setRecorded] = useState(false)

  const score = answers.filter((a, i) => a === questions[i].correctIndex).length
  const allAnswered = answers.every((a) => a !== null)
  const best = quizBest[moduleId]

  function choose(qIndex: number, optIndex: number) {
    if (answers[qIndex] !== null) return
    const next = [...answers]
    next[qIndex] = optIndex
    setAnswers(next)
    if (next.every((a) => a !== null) && !recorded) {
      const finalScore = next.filter((a, i) => a === questions[i].correctIndex).length
      recordQuizResult(moduleId, finalScore)
      setRecorded(true)
    }
  }

  function retry() {
    setAnswers(questions.map(() => null))
    setRecorded(false)
  }

  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Check your understanding</h2>
        {best !== undefined && (
          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            best: {best}/{questions.length}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-6">
        {questions.map((q, qi) => {
          const answered = answers[qi] !== null
          return (
            <div key={q.question}>
              <p className="text-[15px] text-slate-200">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isChosen = answers[qi] === oi
                  const isCorrect = oi === q.correctIndex
                  let style = 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25'
                  if (answered && isCorrect) style = 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                  else if (answered && isChosen && !isCorrect) style = 'border-rose-400/50 bg-rose-400/10 text-rose-200'
                  return (
                    <button
                      key={opt}
                      onClick={() => choose(qi, oi)}
                      disabled={answered}
                      className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${style} ${answered ? 'cursor-default' : ''}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {answered && <p className="mt-2 text-sm text-slate-400">{q.explanation}</p>}
            </div>
          )
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-md border p-4 text-center" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0d` }}>
          <p className="font-mono text-lg font-bold" style={{ color: accent }}>
            {score}/{questions.length}
          </p>
          <p className="mt-1 text-sm text-slate-400">+{xpFromQuizScore(score)} XP toward your rank (best score counts)</p>
          <button onClick={retry} className="mt-3 text-xs text-slate-500 underline decoration-dotted hover:text-slate-300">
            try again
          </button>
        </div>
      )}
    </div>
  )
}
