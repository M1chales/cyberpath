import { CURRICULUM, TOTAL_WEEKS } from '../data/curriculum'
import { useAppState } from '../state/AppStateContext'
import ProgressBar from '../components/ProgressBar'
import ModuleCard from '../components/ModuleCard'

export default function Curriculum() {
  const { core, coreProgress, resetCore } = useAppState()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">The full curriculum</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        {TOTAL_WEEKS} weekly modules across 5 phases. Follow it in order at roughly one module per week and you'll
        finish in under 5 months, with a portfolio to show for it.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <ProgressBar percent={coreProgress.percent} label="Overall progress" />
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <span>
            {coreProgress.count} / {coreProgress.total} weeks marked complete
          </span>
          {coreProgress.count > 0 && (
            <button
              onClick={resetCore}
              className="text-xs text-slate-500 underline decoration-dotted hover:text-slate-300"
            >
              reset progress
            </button>
          )}
        </div>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2">
        {CURRICULUM.map((phase) => (
          <a
            key={phase.id}
            href={`#${phase.id}`}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-slate-400 hover:border-white/25 hover:text-slate-200"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: phase.color }} />
            {phase.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-14">
        {CURRICULUM.map((phase) => (
          <section key={phase.id} id={phase.id} className="scroll-mt-20">
            <div className="flex items-baseline gap-3">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: phase.color }} />
              <h2 className="text-xl font-bold text-white">{phase.title}</h2>
              <span className="font-mono text-xs text-slate-500">
                Weeks {phase.weekRange[0]}–{phase.weekRange[1]}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{phase.summary}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {phase.modules.map((module) => (
                <ModuleCard key={module.id} module={module} color={phase.color} done={core.has(module.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
