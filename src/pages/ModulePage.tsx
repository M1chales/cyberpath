import { Link, useParams } from 'react-router-dom'
import { allModules } from '../data/curriculum'
import { getCoreLesson } from '../data/lessons'
import { getCoreQuiz } from '../data/quizzes'
import { getCoreChallenge } from '../data/challenges'
import { GAME_DEFS } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import LessonContent from '../components/LessonContent'
import ModuleQuiz from '../components/ModuleQuiz'
import ModuleChallenge from '../components/ModuleChallenge'

export default function ModulePage() {
  const { id } = useParams<{ id: string }>()
  const modules = allModules()
  const index = modules.findIndex((m) => m.id === id)
  const module = index >= 0 ? modules[index] : undefined
  const { core, toggleCore } = useAppState()

  if (!module) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-400">Module not found.</p>
        <Link to="/curriculum" className="mt-4 inline-block text-emerald-300 underline">
          Back to curriculum
        </Link>
      </div>
    )
  }

  const prev = modules[index - 1]
  const next = modules[index + 1]
  const done = core.has(module.id)
  const relatedGame = module.relatedGame ? GAME_DEFS.find((g) => g.id === module.relatedGame) : undefined
  const lesson = getCoreLesson(module.id)
  const quiz = getCoreQuiz(module.id)
  const challenge = getCoreChallenge(module.id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/curriculum" className="text-sm text-slate-500 hover:text-slate-300">
        ← Back to curriculum
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Week {module.week}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ backgroundColor: `${module.phaseColor}22`, color: module.phaseColor }}
        >
          {module.phaseTitle}
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-white">{module.title}</h1>
      <p className="mt-2 text-slate-400">{module.tagline}</p>

      <button
        onClick={() => toggleCore(module.id)}
        className={`mt-6 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
          done ? 'bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25' : 'bg-white/10 text-slate-200 hover:bg-white/15'
        }`}
      >
        {done ? '✓ Marked complete' : 'Mark this week complete'}
      </button>

      {lesson && <LessonContent lesson={lesson} accent={module.phaseColor} />}

      {quiz && <ModuleQuiz moduleId={module.id} questions={quiz} accent={module.phaseColor} />}

      {challenge && <ModuleChallenge moduleId={module.id} challenge={challenge} accent={module.phaseColor} />}

      <Section title="You should now be able to">
        <ul className="list-disc space-y-1.5 pl-5">
          {module.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title="Hands-on lab work">
        <ul className="list-disc space-y-1.5 pl-5">
          {module.handsOn.map((h) => (
            <li key={h}>{h}</li>
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

      <Section title="This week's deliverable">
        <p>{module.deliverable}</p>
      </Section>

      {module.certAlignment && (
        <Section title="Certification alignment">
          <div className="flex flex-wrap gap-2">
            {module.certAlignment.map((c) => (
              <span key={c} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
                {c}
              </span>
            ))}
          </div>
        </Section>
      )}

      {relatedGame && (
        <Link
          to={relatedGame.route}
          className="mt-8 flex items-center justify-between rounded-lg border border-emerald-400/25 bg-emerald-400/5 p-4 transition-colors hover:bg-emerald-400/10"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Drill this week's skill</span>
            <p className="mt-1 text-sm text-slate-300">
              {relatedGame.emoji} Play <strong>{relatedGame.title}</strong> — {relatedGame.description}
            </p>
          </div>
          <span className="text-emerald-300">→</span>
        </Link>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link to={`/module/${prev.id}`} className="text-slate-400 hover:text-white">
            ← Week {prev.week}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/module/${next.id}`} className="text-right text-slate-400 hover:text-white">
            Week {next.week}: {next.title} →
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
