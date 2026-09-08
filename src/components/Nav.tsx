import { NavLink } from 'react-router-dom'
import { useAppState } from '../state/AppStateContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/curriculum', label: 'Curriculum' },
  { to: '/mastery', label: 'Mastery' },
  { to: '/games', label: 'Games' },
  { to: '/console', label: 'Console ⌨️' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/careers', label: 'Careers & Certs' },
]

export default function Nav({ onSearchClick }: { onSearchClick: () => void }) {
  const { xp, streak } = useAppState()

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#05070a]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <NavLink to="/" className="flex shrink-0 items-center gap-2 font-mono text-sm font-semibold text-slate-100">
          <span className="text-emerald-400">&gt;_</span>
          <span>
            cyber<span className="text-emerald-400">path</span>
          </span>
        </NavLink>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 transition-colors ${
                  isActive ? 'bg-emerald-400/10 text-emerald-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onSearchClick}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400 hover:border-white/25 hover:text-slate-200 sm:flex"
          >
            <span>🔍</span>
            <span>Search</span>
            <kbd className="rounded border border-white/10 px-1 text-[10px] text-slate-600">/</kbd>
          </button>
          <button
            onClick={onSearchClick}
            className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-1.5 text-slate-400 hover:border-white/25 hover:text-slate-200 sm:hidden"
            aria-label="Search"
          >
            🔍
          </button>
          <NavLink
            to="/progress"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300 hover:border-white/25"
          >
            <span className="font-semibold text-emerald-300">{xp.level.title}</span>
            <span className="text-slate-600">·</span>
            <span>{xp.totalXp} XP</span>
            {streak.current > 0 && (
              <>
                <span className="text-slate-600">·</span>
                <span>🔥{streak.current}</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-2 text-sm md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `shrink-0 rounded-md px-3 py-1.5 transition-colors ${
                isActive ? 'bg-emerald-400/10 text-emerald-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
