import { useState } from 'react'
import { Link } from 'react-router-dom'
import { allModules } from '../data/curriculum'
import { allMasteryModules } from '../data/masteryTrack'
import { GAME_DEFS } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { useConsoleWorld } from '../state/ConsoleWorldContext'

export default function Portfolio() {
  const { xp, coreProgress, masteryProgress, gameBest, badges, streak, core, mastery } = useAppState()
  const { world } = useConsoleWorld()
  const [copied, setCopied] = useState(false)

  const modules = allModules()
  const completedCore = modules.filter((m) => core.has(m.id))
  const masteryModules = allMasteryModules()
  const completedMastery = masteryModules.filter((m) => mastery.has(m.id))

  const certs = new Set<string>()
  for (const m of completedCore) m.certAlignment?.forEach((c) => certs.add(c))

  const earnedBadges = badges.filter((b) => b.earned)
  const rootedHosts = world.hosts.filter((h) => h.rootObtained && h.id !== 'home')
  const userAccessHosts = world.hosts.filter((h) => h.userCompromised && h.id !== 'home')
  const totalConsoleHosts = world.hosts.length - 1

  function buildMarkdown(): string {
    const lines: string[] = []
    lines.push('# Cybersecurity Learning Portfolio')
    lines.push('')
    lines.push(`Rank: **${xp.level.title}** — ${xp.totalXp} XP earned`)
    lines.push(`Core path: ${coreProgress.count}/${coreProgress.total} weeks complete`)
    if (masteryProgress.count > 0) lines.push(`Mastery track: ${masteryProgress.count}/${masteryProgress.total} modules complete`)
    lines.push('')

    if (completedCore.length > 0) {
      lines.push('## Deliverables produced')
      for (const m of completedCore) {
        lines.push(`- **Week ${m.week}: ${m.title}** — ${m.deliverable}`)
      }
      lines.push('')
    }

    if (completedMastery.length > 0) {
      lines.push('## Mastery track work')
      for (const m of completedMastery) {
        lines.push(`- **${m.title}** (${m.trackTitle})`)
      }
      lines.push('')
    }

    if (rootedHosts.length > 0 || userAccessHosts.length > 0) {
      lines.push('## Hands-on practice (Console)')
      lines.push(`- Gained access on ${userAccessHosts.length}/${totalConsoleHosts} simulated hosts`)
      lines.push(`- Achieved full root on ${rootedHosts.length}/${totalConsoleHosts} simulated hosts`)
      if (world.player.vulnClassesUsed.length > 0) {
        lines.push(`- Real vulnerability classes actually exploited: ${world.player.vulnClassesUsed.join(', ')}`)
      }
      if (world.incidentsResolved > 0) lines.push(`- Resolved ${world.incidentsResolved} live simulated incident(s) under time pressure`)
      lines.push('')
    }

    const playedGames = GAME_DEFS.filter((g) => (gameBest[g.id] ?? 0) > 0)
    if (playedGames.length > 0) {
      lines.push('## Applied skill drills')
      for (const g of playedGames) {
        lines.push(`- ${g.title}: ${gameBest[g.id]}/${g.maxScore}`)
      }
      lines.push('')
    }

    if (certs.size > 0) {
      lines.push('## Certification alignment')
      lines.push(Array.from(certs).map((c) => `- ${c}`).join('\n'))
      lines.push('')
    }

    if (earnedBadges.length > 0) {
      lines.push('## Badges earned')
      lines.push(earnedBadges.map((b) => `- ${b.emoji} ${b.title} — ${b.description}`).join('\n'))
      lines.push('')
    }

    lines.push(`Longest study streak: ${streak.longest} day(s)`)
    lines.push('')
    lines.push('_Generated from self-paced coursework and a self-hosted practice simulation — not a substitute for a real credential or verified work history. Presented alongside real HackTheBox/TryHackMe activity where possible._')
    return lines.join('\n')
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(buildMarkdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — the button just won't confirm; nothing else to do
    }
  }

  const hasAnyProgress = completedCore.length > 0 || completedMastery.length > 0 || userAccessHosts.length > 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Your portfolio</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Every deliverable, mastery module, and Console root you've actually completed, compiled into one page —
        because a course is only a portfolio once someone else can see the work.
      </p>

      {!hasAnyProgress ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
          Nothing to show yet. Complete a module in the{' '}
          <Link to="/curriculum" className="text-emerald-300 hover:text-emerald-200">
            curriculum
          </Link>{' '}
          or get user access on a host in the{' '}
          <Link to="/console" className="text-emerald-300 hover:text-emerald-200">
            Console
          </Link>{' '}
          and this page fills in automatically.
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Rank</span>
              <div className="text-xl font-bold text-white">{xp.level.title}</div>
              <p className="mt-1 text-xs text-slate-500">{xp.totalXp} XP · {coreProgress.count}/{coreProgress.total} core weeks · {rootedHosts.length}/{totalConsoleHosts} hosts rooted</p>
            </div>
            <button
              onClick={copyMarkdown}
              className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-emerald-300"
            >
              {copied ? 'Copied ✓' : 'Copy as Markdown'}
            </button>
          </div>

          {completedCore.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-white">Deliverables produced</h2>
              <ul className="mt-3 space-y-2">
                {completedCore.map((m) => (
                  <li key={m.id} className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-sm">
                    <span className="font-mono text-xs text-slate-500">Week {m.week}</span>{' '}
                    <span className="font-semibold text-slate-100">{m.title}</span>
                    <p className="mt-1 text-slate-400">{m.deliverable}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {completedMastery.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-white">Mastery track work</h2>
              <ul className="mt-3 space-y-1">
                {completedMastery.map((m) => (
                  <li key={m.id} className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-sm">
                    <span className="font-semibold text-slate-100">{m.title}</span>{' '}
                    <span className="text-xs text-slate-500">({m.trackTitle})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(userAccessHosts.length > 0 || rootedHosts.length > 0) && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-white">Hands-on practice (Console)</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-center">
                  <div className="font-mono text-xl text-emerald-300">
                    {userAccessHosts.length}/{totalConsoleHosts}
                  </div>
                  <div className="text-xs text-slate-500">hosts accessed</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-center">
                  <div className="font-mono text-xl text-emerald-300">
                    {rootedHosts.length}/{totalConsoleHosts}
                  </div>
                  <div className="text-xs text-slate-500">hosts rooted</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-center">
                  <div className="font-mono text-xl text-emerald-300">{world.player.vulnClassesUsed.length}/9</div>
                  <div className="text-xs text-slate-500">real vuln classes used</div>
                </div>
              </div>
            </section>
          )}

          {certs.size > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-white">Certification alignment</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(certs).map((c) => (
                  <span key={c} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="mt-12 rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/5 p-6">
        <h2 className="text-lg font-bold text-white">The stronger next step</h2>
        <p className="mt-2 text-sm text-slate-300">
          A hiring manager can independently verify activity on HackTheBox or TryHackMe — they can't verify what
          happened in this app's local browser storage. Once this portfolio has real substance, the highest-leverage
          next move is putting the same effort into a public profile on one of those platforms.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a href="https://www.hackthebox.com/" target="_blank" rel="noreferrer" className="text-fuchsia-300 underline decoration-dotted hover:text-fuchsia-200">
            HackTheBox ↗
          </a>
          <a href="https://tryhackme.com/" target="_blank" rel="noreferrer" className="text-fuchsia-300 underline decoration-dotted hover:text-fuchsia-200">
            TryHackMe ↗
          </a>
        </div>
      </section>
    </div>
  )
}
