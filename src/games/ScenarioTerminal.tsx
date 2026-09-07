import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GameResult } from '../components/GameShell'
import { runLine, ShellError } from '../terminal-sim/commands'
import type { Scenario, ShellState } from '../terminal-sim/types'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'

interface LogEntry {
  kind: 'input' | 'output' | 'error' | 'system' | 'hint' | 'objective'
  text: string
}

const colorFor: Record<LogEntry['kind'], string> = {
  input: 'text-slate-100',
  output: 'text-slate-300',
  error: 'text-rose-400',
  system: 'text-slate-500',
  hint: 'text-amber-300',
  objective: 'text-emerald-400',
}

function briefingLog(scenario: Scenario): LogEntry[] {
  return [
    { kind: 'system', text: `── ${scenario.title} ──` },
    ...scenario.briefing.map((b) => ({ kind: 'output' as const, text: b })),
    { kind: 'system', text: 'Type `objectives` anytime to see your checklist, `hint` if stuck, `help` for available commands.' },
  ]
}

export default function ScenarioTerminal({ scenario, gameId }: { scenario: Scenario; gameId: string }) {
  const { recordGameResult } = useAppState()
  const stateRef = useRef<ShellState>(scenario.buildInitialState())

  const [log, setLog] = useState<LogEntry[]>(() => briefingLog(scenario))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyPos, setHistoryPos] = useState<number | null>(null)
  const [hintIndex, setHintIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  // Mirrors stateRef's objective-completion status into real React state, so the render
  // path never reads stateRef.current directly (refs shouldn't be read during render).
  const [objectiveDone, setObjectiveDone] = useState<boolean[]>(() =>
    scenario.objectives.map((o) => o.check(scenario.buildInitialState())),
  )

  const logEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'end' })
  }, [log])

  function append(entries: LogEntry | LogEntry[]) {
    setLog((prev) => [...prev, ...(Array.isArray(entries) ? entries : [entries])])
  }

  function objectivesText(): string[] {
    return scenario.objectives.map((o) => {
      const done = o.check(stateRef.current)
      return `${done ? '[x]' : '[ ]'} ${o.label}`
    })
  }

  function refreshObjectives() {
    const now = scenario.objectives.map((o) => o.check(stateRef.current))
    now.forEach((done, i) => {
      if (done && !objectiveDone[i]) {
        append({ kind: 'objective', text: `✅ Objective complete: ${scenario.objectives[i].label}` })
      }
    })
    setObjectiveDone(now)
  }

  function finishNow() {
    const score = objectiveDone.filter(Boolean).length
    setFinalScore(score)
    setFinished(true)
    recordGameResult(gameId, score)
  }

  function submit() {
    const raw = input
    if (raw.trim().length === 0) return
    setHistory((h) => [...h, raw])
    setHistoryPos(null)
    setInput('')
    append({ kind: 'input', text: `${scenario.prompt} ${raw}` })

    const lower = raw.trim().toLowerCase()

    if (lower === 'clear') {
      setLog(briefingLog(scenario))
      return
    }
    if (lower === 'help') {
      append({ kind: 'system', text: `Available commands here: ${scenario.commands.join(', ')} — plus objectives, hint, clear.` })
      return
    }
    if (lower === 'hint') {
      append({ kind: 'hint', text: `💡 ${scenario.hints[hintIndex % scenario.hints.length]}` })
      setHintIndex((i) => i + 1)
      return
    }
    if (lower === 'objectives' || lower === 'status') {
      append(objectivesText().map((t) => ({ kind: 'system' as const, text: t })))
      return
    }

    try {
      const output = runLine(raw, stateRef.current)
      if (output.length > 0) append(output.map((t) => ({ kind: 'output' as const, text: t })))
      refreshObjectives()
    } catch (e) {
      const message = e instanceof ShellError ? e.message : 'command failed'
      append({ kind: 'error', text: message })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const pos = historyPos === null ? history.length - 1 : Math.max(0, historyPos - 1)
      setHistoryPos(pos)
      setInput(history[pos])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyPos === null) return
      const pos = historyPos + 1
      if (pos >= history.length) {
        setHistoryPos(null)
        setInput('')
      } else {
        setHistoryPos(pos)
        setInput(history[pos])
      }
    }
  }

  function replay() {
    stateRef.current = scenario.buildInitialState()
    setObjectiveDone(scenario.objectives.map((o) => o.check(stateRef.current)))
    setLog(briefingLog(scenario))
    setInput('')
    setHistory([])
    setHistoryPos(null)
    setHintIndex(0)
    setFinished(false)
    setFinalScore(0)
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link to="/games" className="text-sm text-slate-500 hover:text-slate-300">
          ← Back to games
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl">{scenario.emoji}</span>
          <h1 className="text-2xl font-bold text-white">{scenario.title}</h1>
        </div>
        <div className="mt-8">
          <GameResult
            score={finalScore}
            maxScore={scenario.objectives.length}
            scoreUnit="objectives completed"
            xpEarned={xpFromGameScore(finalScore, scenario.objectives.length)}
            onReplay={replay}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/games" className="text-sm text-slate-500 hover:text-slate-300">
        ← Back to games
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl">{scenario.emoji}</span>
        <h1 className="text-2xl font-bold text-white">{scenario.title}</h1>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        A real, self-contained simulated filesystem/environment — commands actually change its state. Not a real network or machine.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px]">
        <div
          className="h-[440px] overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-sm thin-scroll"
          onClick={() => inputRef.current?.focus()}
        >
          {log.map((entry, i) => (
            <div key={i} className={`whitespace-pre-wrap ${colorFor[entry.kind]}`}>
              {entry.text}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2 text-slate-100">
            <span className="text-slate-500">{scenario.prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <div ref={logEndRef} />
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Objectives</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {scenario.objectives.map((o, i) => {
              const done = objectiveDone[i]
              return (
                <li key={o.id} className={done ? 'text-emerald-300' : 'text-slate-400'}>
                  {done ? '✅' : '⬜'} {o.label}
                </li>
              )
            })}
          </ul>
          <button
            onClick={finishNow}
            className="mt-4 w-full rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/15"
          >
            Finish & record score
          </button>
        </div>
      </div>
    </div>
  )
}
