import { Link } from 'react-router-dom'
import { MASTERY_TRACK, CONTINUOUS_PRACTICES } from '../data/masteryTrack'
import { useAppState } from '../state/AppStateContext'
import ProgressBar from '../components/ProgressBar'

export default function MasteryTrack() {
  const { mastery, masteryProgress, resetMastery } = useAppState()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">The Mastery Track</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Real specializations, past the 5-month job-ready core path. This is deliberately not organized into fixed
        weeks — each of these takes real, ongoing practice to actually master, on a timeline measured in years, not
        a syllabus.
      </p>
      <div className="mt-4 max-w-2xl rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
        Every module below lists what to learn, what to practice, and a candid note on what real mastery actually
        requires beyond this site. Check modules off as you build real, demonstrable skill in them — not just after
        reading.
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <ProgressBar percent={masteryProgress.percent} label="Mastery track progress" color="#e879f9" />
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <span>
            {masteryProgress.count} / {masteryProgress.total} modules marked complete
          </span>
          {masteryProgress.count > 0 && (
            <button onClick={resetMastery} className="text-xs text-slate-500 underline decoration-dotted hover:text-slate-300">
              reset progress
            </button>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-14">
        {MASTERY_TRACK.map((track) => (
          <section key={track.id}>
            <div className="flex items-baseline gap-3">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: track.color }} />
              <h2 className="text-xl font-bold text-white">{track.title}</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{track.summary}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {track.modules.map((module) => {
                const done = mastery.has(module.id)
                return (
                  <Link
                    key={module.id}
                    to={`/mastery/${module.id}`}
                    className="group flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-slate-500">{track.title}</span>
                      {done && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                          ✓ done
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-white">{module.title}</h3>
                    <p className="text-sm text-slate-400">{module.tagline}</p>
                    <div className="mt-1 h-1 w-8 rounded-full" style={{ backgroundColor: track.color }} />
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold text-white">Continuous mastery habits</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          These are not modules you finish — they are ongoing practices that professionals return to for their whole
          career. This is genuinely where long-term mastery is built.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CONTINUOUS_PRACTICES.map((practice) => (
            <div key={practice.title} className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold text-slate-100">{practice.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{practice.description}</p>
              {practice.resources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {practice.resources.map((r) => (
                    <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-300 underline decoration-dotted hover:text-emerald-200">
                      {r.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
