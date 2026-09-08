import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildSearchIndex, searchItems } from '../lib/searchIndex'

const categoryColor: Record<string, string> = {
  Page: 'text-slate-400',
  Curriculum: 'text-emerald-300',
  Mastery: 'text-fuchsia-300',
  Game: 'text-amber-300',
}

// Mounted only while open (the parent conditionally renders this), so every open is a fresh
// mount — state starts clean with no reset effect needed, and `autoFocus` handles the input.
export default function SearchPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const index = useMemo(() => buildSearchIndex(), [])
  const results = useMemo(() => searchItems(index, query), [index, query])

  function handleQueryChange(value: string) {
    setQuery(value)
    setActiveIndex(0)
  }

  function go(route: string) {
    navigate(route)
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[activeIndex]
      if (item) go(item.route)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-white/15 bg-[#0a0e14] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="text-slate-500">🔍</span>
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search weeks, mastery modules, games, pages…"
            spellCheck={false}
            autoComplete="off"
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500">Esc</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto thin-scroll">
          {query.trim() === '' ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              Start typing to search everything — curriculum weeks, mastery modules, games, and pages.
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">No matches for "{query}".</p>
          ) : (
            <ul>
              {results.map((item, i) => (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.route)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      i === activeIndex ? 'bg-white/10' : ''
                    }`}
                  >
                    <span>
                      <span className="text-slate-100">{item.title}</span>
                      <span className="ml-2 text-xs text-slate-500">{item.subtitle}</span>
                    </span>
                    <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${categoryColor[item.category] ?? 'text-slate-500'}`}>
                      {item.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
