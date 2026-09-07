import { Link, useParams } from 'react-router-dom'
import { allMasteryModules } from '../data/masteryTrack'
import { getMasteryLesson } from '../data/lessons'
import { getMasteryQuiz } from '../data/quizzes'
import { getMasteryChallenge } from '../data/challenges'
import { GAME_DEFS } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import LessonContent from '../components/LessonContent'
import ModuleQuiz from '../components/ModuleQuiz'
import ModuleChallenge from '../components/ModuleChallenge'

export default function MasteryModulePage() {
  const { id } = useParams<{ id: string }>()
  const modules = allMasteryModules()
  const index = modules.findIndex((m) => m.id === id)
  const module = index >= 0 ? modules[index] : undefined
  const { mastery, toggleMastery } = useAppState()

  if (!module) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-400">Module not found.</p>
        <Link to="/mastery" className="mt-4 inline-block text-emerald-300 underline">
          Back to the mastery track
        </Link>
      </div>
    )
  }

  const prev = modules[index - 1]
  const next = modules[index + 1]
  const done = mastery.has(module.id)
  const relatedGame = module.relatedGame ? GAME_DEFS.find((g) => g.id === module.relatedGame) : undefined
  const lesson = getMasteryLesson(module.id)
  const quiz = getMasteryQuiz(module.id)
  const challenge = getMasteryChallenge(module.id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/mastery" className="text-sm text-slate-500 hover:text-slate-300">
        ← Back to the mastery track
      </Link>

      <div className="mt-4">
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ backgroundColor: `${module.trackColor}22`, color: module.trackColor }}
        >
          {module.trackTitle}
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-white">{module.title}</h1>
      <p className="mt-2 text-slate-400">{module.tagline}</p>

      <button
        onClick={() => toggleMastery(module.id)}
        className={`mt-6 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
          done ? 'bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25' : 'bg-white/10 text-slate-200 hover:bg-white/15'
        }`}
      >
        {done ? '✓ Marked complete' : 'Mark this module complete'}
      </button>

      <div className="mt-6 rounded-md border border-fuchsia-400/20 bg-fuchsia-400/5 p-4 text-sm text-fuchsia-100">
        <strong>Reality check:</strong> {module.realWorldNote}
      </div>

      {lesson && <LessonContent lesson={lesson} accent={module.trackColor} />}

      {quiz && <ModuleQuiz moduleId={module.id} questions={quiz} accent={module.trackColor} />}

      {challenge && <ModuleChallenge moduleId={module.id} challenge={challenge} accent={module.trackColor} />}

      <Section title="You should now be able to">
        <ul className="list-disc space-y-1.5 pl-5">
          {module.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title="How to practice this for real">
        <ul className="list-disc space-y-1.5 pl-5">
          {module.practice.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section title="Resources">
        <ul className="space-y-1.5">
          {module.resources.map((r) => (
            <li key={r.label}>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer" className="text-emerald-300 underline decoration-dotted hover:text-emerald-200">
                  {r.label} ↗
                </a>
              ) : (
                r.label
              )}
            </li>
          ))}
        </ul>
      </Section>

      {relatedGame && (
        <Link
          to={relatedGame.route}
          className="mt-8 flex items-center justify-between rounded-lg border border-emerald-400/25 bg-emerald-400/5 p-4 transition-colors hover:bg-emerald-400/10"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Drill this skill</span>
            <p className="mt-1 text-sm text-slate-300">
              {relatedGame.emoji} Play <strong>{relatedGame.title}</strong> — {relatedGame.description}
            </p>
          </div>
          <span className="text-emerald-300">→</span>
        </Link>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link to={`/mastery/${prev.id}`} className="text-slate-400 hover:text-white">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/mastery/${next.id}`} className="text-right text-slate-400 hover:text-white">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-slate-300">{children}</div>
    </div>
  )
}
