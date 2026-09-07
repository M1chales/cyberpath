import { Link } from 'react-router-dom'
import { CURRICULUM, TOTAL_WEEKS } from '../data/curriculum'
import { MASTERY_TRACK, TOTAL_MASTERY_MODULES } from '../data/masteryTrack'
import { GAME_DEFS } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import ProgressBar from '../components/ProgressBar'

export default function Home() {
  const { coreProgress, xp } = useAppState()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="flex flex-col items-start gap-6">
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">
          100% free · self-paced · {TOTAL_WEEKS}-week core path + a full mastery track
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
          Learn to defend, not just to be defended.
        </h1>
        <p className="max-w-2xl text-lg text-slate-400">
          cyberpath is a free, in-depth cybersecurity education for absolutely everyone — from protecting your own
          family from scams, to a job-ready foundation in under 5 months, to a full mastery track of real
          specializations for the years after that. Learn it, practice it in hands-on labs, and gamify it with
          mini-games that make the reps stick.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/curriculum"
            className="rounded-md bg-emerald-400 px-5 py-2.5 font-semibold text-black transition-colors hover:bg-emerald-300"
          >
            Start the core path
          </Link>
          <Link
            to="/mastery"
            className="rounded-md border border-white/15 px-5 py-2.5 font-semibold text-slate-100 transition-colors hover:bg-white/5"
          >
            Explore the mastery track
          </Link>
          <Link
            to="/games"
            className="rounded-md border border-white/15 px-5 py-2.5 font-semibold text-slate-100 transition-colors hover:bg-white/5"
          >
            Play the games
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Your rank</span>
            <div className="text-lg font-bold text-white">{xp.level.title}</div>
          </div>
          <Link to="/progress" className="text-sm text-emerald-300 hover:text-emerald-200">
            View full progress →
          </Link>
        </div>
        <div className="mt-3">
          <ProgressBar percent={xp.percent} label={`${xp.totalXp} / ${xp.totalPossible} XP toward total mastery`} />
        </div>
        {coreProgress.count > 0 && (
          <p className="mt-2 text-sm text-slate-400">
            {coreProgress.count} of {coreProgress.total} core weeks complete. Keep going.
          </p>
        )}
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-4">
        <Stat value="5" label="months or less for the job-ready core path" />
        <Stat value={`${TOTAL_WEEKS}`} label="core weekly modules with hands-on labs" />
        <Stat value={`${TOTAL_MASTERY_MODULES}`} label="advanced mastery-track specialization modules" />
        <Stat value={`${GAME_DEFS.length}`} label="interactive games that drill the skills in" />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Why this exists</h2>
        <p className="mt-3 max-w-3xl text-slate-400">
          Most breaches don't happen because of nation-state zero-days — they happen because nobody in the room knew
          basic hygiene, nobody caught the phishing email, or nobody knew what to do in the first ten minutes of an
          incident. This exists so that, no matter what you do for a living, you can be that person: for your
          family, your small business, your community — or as your actual career.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-500">
          Honest framing: the 5-month core path makes you genuinely job-ready. The mastery track past it maps out
          real specializations that professionals spend years deepening — this site gives you the full map and the
          practice reps; the years of real-world incidents are the part no course can hand you, only point you
          toward.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">The core path, phase by phase</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM.map((phase) => (
            <div key={phase.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-2 h-1 w-10 rounded-full" style={{ backgroundColor: phase.color }} />
              <h3 className="font-semibold text-slate-100">{phase.title}</h3>
              <p className="mt-1 text-xs font-mono text-slate-500">
                Weeks {phase.weekRange[0]}–{phase.weekRange[1]}
              </p>
              <p className="mt-2 text-sm text-slate-400">{phase.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-white">Then: the mastery track</h2>
          <Link to="/mastery" className="text-sm text-emerald-300 hover:text-emerald-200">
            See all specializations →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MASTERY_TRACK.map((track) => (
            <div key={track.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-2 h-1 w-10 rounded-full" style={{ backgroundColor: track.color }} />
              <h3 className="font-semibold text-slate-100">{track.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{track.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-white">Learn it by playing it</h2>
          <Link to="/games" className="text-sm text-emerald-300 hover:text-emerald-200">
            Open the games hub →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_DEFS.map((game) => (
            <Link
              key={game.id}
              to={game.route}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
            >
              <div className="text-2xl">{game.emoji}</div>
              <h3 className="mt-2 font-semibold text-slate-100">{game.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{game.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
      <div className="font-mono text-3xl font-bold text-emerald-300">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  )
}
