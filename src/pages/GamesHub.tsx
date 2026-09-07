import { Link } from 'react-router-dom'
import { GAME_DEFS, xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'

export default function GamesHub() {
  const { gameBest, gamePlays } = useAppState()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Games</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Short, replayable drills that turn what you read in the curriculum into instinct. Each one contributes XP
        toward your overall rank — your best score always counts, so replay any time to improve it.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GAME_DEFS.map((game) => {
          const best = gameBest[game.id] ?? 0
          const plays = gamePlays[game.id] ?? 0
          const xp = xpFromGameScore(best, game.maxScore)
          return (
            <Link
              key={game.id}
              to={game.route}
              className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{game.emoji}</span>
                {plays > 0 && (
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                    best: {best}/{game.maxScore}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-100">{game.title}</h3>
              <p className="text-sm text-slate-400">{game.description}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>{plays > 0 ? `played ${plays}×` : 'not played yet'}</span>
                <span>+{xp} XP so far</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
