import { Link } from 'react-router-dom'
import { allModules } from '../data/curriculum'
import { allMasteryModules } from '../data/masteryTrack'
import { CORE_QUIZZES, MASTERY_QUIZZES, QUIZ_LENGTH } from '../data/quizzes'
import { CORE_CHALLENGES, MASTERY_CHALLENGES, CHALLENGE_MAX_RATING } from '../data/challenges'
import { GAME_DEFS, xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import ProgressBar from '../components/ProgressBar'

const TOTAL_QUIZZABLE = Object.keys(CORE_QUIZZES).length + Object.keys(MASTERY_QUIZZES).length
const TOTAL_CHALLENGEABLE = Object.keys(CORE_CHALLENGES).length + Object.keys(MASTERY_CHALLENGES).length
const CHALLENGE_RATING_LABELS = ['Need to revisit', 'Partially got it', 'Nailed it']

const MODULE_TARGETS: Record<string, { title: string; route: string }> = {
  ...Object.fromEntries(allModules().map((m) => [m.id, { title: `Week ${m.week}: ${m.title}`, route: `/module/${m.id}` }])),
  ...Object.fromEntries(allMasteryModules().map((m) => [m.id, { title: m.title, route: `/mastery/${m.id}` }])),
}

export default function Progress() {
  const { xp, badges, streak, coreProgress, masteryProgress, gameBest, gamePlays, quizBest, challengeBest, resetAll } = useAppState()

  const earnedBadges = badges.filter((b) => b.earned)
  const lockedBadges = badges.filter((b) => !b.earned)
  const quizzesAttempted = Object.keys(quizBest).length
  const quizzesPerfect = Object.values(quizBest).filter((v) => v >= QUIZ_LENGTH).length
  const weakSpots = Object.entries(quizBest)
    .filter(([, score]) => score < QUIZ_LENGTH - 1)
    .map(([id, score]) => ({ id, score, ...MODULE_TARGETS[id] }))
    .filter((w) => w.title)

  const challengesAttempted = Object.keys(challengeBest).length
  const challengesNailed = Object.values(challengeBest).filter((v) => v >= CHALLENGE_MAX_RATING).length
  const challengesToRevisit = Object.entries(challengeBest)
    .filter(([, rating]) => rating === 0)
    .map(([id, rating]) => ({ id, rating, ...MODULE_TARGETS[id] }))
    .filter((w) => w.title)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Your progress</h1>
      <p className="mt-2 text-slate-400">Everything here is stored only in this browser — nothing is uploaded anywhere.</p>

      <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Rank</span>
            <div className="text-2xl font-bold text-white">{xp.level.title}</div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Total XP</span>
            <div className="font-mono text-2xl font-bold text-emerald-300">
              {xp.totalXp} <span className="text-sm text-slate-500">/ {xp.totalPossible}</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-400">{xp.level.blurb}</p>
        <div className="mt-4">
          <ProgressBar percent={xp.percent} label={xp.nextLevel ? `Progress to "${xp.nextLevel.title}"` : 'Maximum rank reached'} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-5">
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.coreXp}</div>
            <div className="text-xs text-slate-500">core XP</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.masteryXp}</div>
            <div className="text-xs text-slate-500">mastery XP</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.gamesXp}</div>
            <div className="text-xs text-slate-500">games XP</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.quizXp}</div>
            <div className="text-xs text-slate-500">quiz XP</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.challengeXp}</div>
            <div className="text-xs text-slate-500">challenge XP</div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-sky-300">
            {coreProgress.count}/{coreProgress.total}
          </div>
          <div className="mt-1 text-xs text-slate-500">core weeks complete</div>
          <Link to="/curriculum" className="mt-2 block text-xs text-emerald-300 hover:text-emerald-200">
            View curriculum →
          </Link>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-fuchsia-300">
            {masteryProgress.count}/{masteryProgress.total}
          </div>
          <div className="mt-1 text-xs text-slate-500">mastery modules complete</div>
          <Link to="/mastery" className="mt-2 block text-xs text-emerald-300 hover:text-emerald-200">
            View mastery track →
          </Link>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
          <div className="font-mono text-2xl font-bold text-orange-300">🔥 {streak.current}</div>
          <div className="mt-1 text-xs text-slate-500">day streak (longest: {streak.longest})</div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Badges ({earnedBadges.length}/{badges.length})</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[...earnedBadges, ...lockedBadges].map((badge) => (
            <div
              key={badge.id}
              className={`rounded-lg border p-4 text-center ${badge.earned ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10 bg-white/[0.02] opacity-50'}`}
            >
              <div className="text-2xl">{badge.emoji}</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{badge.title}</div>
              <div className="mt-1 text-xs text-slate-500">{badge.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Game scores</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {GAME_DEFS.map((game) => {
            const best = gameBest[game.id] ?? 0
            const plays = gamePlays[game.id] ?? 0
            return (
              <Link
                key={game.id}
                to={game.route}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/25"
              >
                <div>
                  <div className="font-semibold text-slate-100">
                    {game.emoji} {game.title}
                  </div>
                  <div className="text-xs text-slate-500">{plays > 0 ? `played ${plays}×` : 'not played yet'}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-slate-200">
                    {best}/{game.maxScore}
                  </div>
                  <div className="text-xs text-emerald-400">+{xpFromGameScore(best, game.maxScore)} XP</div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Knowledge checks</h2>
        <p className="mt-1 text-sm text-slate-400">Every module has a 4-question check — this is what actually verifies the lesson landed, not just that you read it.</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">
              {quizzesAttempted}/{TOTAL_QUIZZABLE}
            </div>
            <div className="text-xs text-slate-500">quizzes attempted</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{quizzesPerfect}</div>
            <div className="text-xs text-slate-500">scored {QUIZ_LENGTH}/{QUIZ_LENGTH}</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.quizXp}</div>
            <div className="text-xs text-slate-500">quiz XP</div>
          </div>
        </div>
        {weakSpots.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-slate-400">Worth another pass (scored {QUIZ_LENGTH - 2} or fewer):</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weakSpots.map((w) => (
                <Link
                  key={w.id}
                  to={w.route}
                  className="rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-xs text-amber-300 hover:bg-amber-400/10"
                >
                  {w.title} ({w.score}/{QUIZ_LENGTH})
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Challenges</h2>
        <p className="mt-1 text-sm text-slate-400">
          One applied scenario per module — you write an actual answer, compare it to a model answer, and rate yourself honestly. This is where reading turns into doing.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">
              {challengesAttempted}/{TOTAL_CHALLENGEABLE}
            </div>
            <div className="text-xs text-slate-500">challenges attempted</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{challengesNailed}</div>
            <div className="text-xs text-slate-500">rated "nailed it"</div>
          </div>
          <div className="rounded-md bg-white/[0.03] p-3">
            <div className="font-mono text-lg text-slate-100">{xp.challengeXp}</div>
            <div className="text-xs text-slate-500">challenge XP</div>
          </div>
        </div>
        {challengesToRevisit.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-slate-400">Rated "{CHALLENGE_RATING_LABELS[0]}" — worth another attempt:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {challengesToRevisit.map((c) => (
                <Link
                  key={c.id}
                  to={c.route}
                  className="rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-xs text-amber-300 hover:bg-amber-400/10"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-12 border-t border-white/10 pt-6">
        <button onClick={resetAll} className="text-xs text-slate-600 underline decoration-dotted hover:text-slate-400">
          reset all progress, badges, and scores
        </button>
      </section>
    </div>
  )
}
