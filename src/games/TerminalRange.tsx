import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { TERMINAL_ROUNDS, type TerminalRound } from './terminalData'

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

interface LogEntry {
  kind: 'briefing' | 'input' | 'success' | 'error' | 'hint' | 'reveal' | 'system'
  text: string
}

function checkMatch(round: TerminalRound, raw: string): boolean {
  return round.patterns.every((p) => p.test(raw))
}

function briefingEntries(round: TerminalRound, index: number, total: number): LogEntry[] {
  return [
    { kind: 'system', text: `── Round ${index + 1}/${total} · ${round.role === 'blue' ? 'BLUE TEAM (defend)' : 'RED TEAM (authorized test)'} ──` },
    { kind: 'briefing', text: round.scenario },
    { kind: 'briefing', text: `TASK: ${round.task}` },
  ]
}

export default function TerminalRange() {
  const { recordGameResult } = useAppState()
  const [rounds, setRounds] = useState(() => shuffled(TERMINAL_ROUNDS))

  const [roundIndex, setRoundIndex] = useState(0)
  const [log, setLog] = useState<LogEntry[]>(() => briefingEntries(rounds[0], 0, rounds.length))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyPos, setHistoryPos] = useState<number | null>(null)
  const [solvedFlags, setSolvedFlags] = useState<('unsolved' | 'solved' | 'revealed')[]>(() => rounds.map(() => 'unsolved'))
  const [finished, setFinished] = useState(false)

  const logEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'end' })
  }, [log])

  const round = rounds[roundIndex]
  const status = solvedFlags[roundIndex]

  function append(entries: LogEntry | LogEntry[]) {
    setLog((prev) => [...prev, ...(Array.isArray(entries) ? entries : [entries])])
  }

  function advanceRound() {
    const next = roundIndex + 1
    if (next >= rounds.length) {
      const score = solvedFlags.filter((s) => s === 'solved').length
      recordGameResult('terminal-range', score)
      setFinished(true)
      return
    }
    setRoundIndex(next)
    append(briefingEntries(rounds[next], next, rounds.length))
  }

  function submit() {
    const raw = input
    if (raw.trim().length === 0) return
    setHistory((h) => [...h, raw])
    setHistoryPos(null)
    setInput('')
    append({ kind: 'input', text: `${round.prompt} ${raw}` })

    const lower = raw.trim().toLowerCase()

    if (lower === 'clear') {
      setLog(briefingEntries(round, roundIndex, rounds.length))
      return
    }
    if (lower === 'help') {
      append({ kind: 'system', text: 'Type the actual command for the task. Meta-commands: hint · reveal · clear · next' })
      return
    }
    if (lower === 'hint') {
      append({ kind: 'hint', text: `💡 ${round.hint}` })
      return
    }
    if (lower === 'reveal' || lower === 'solution') {
      if (status === 'unsolved') setSolvedFlags((prev) => prev.map((s, i) => (i === roundIndex ? 'revealed' : s)))
      append([
        { kind: 'reveal', text: `Example: ${round.exampleCommand}` },
        { kind: 'reveal', text: round.explanation },
        { kind: 'system', text: 'Type `next` or press the button below to continue.' },
      ])
      return
    }
    if (lower === 'next') {
      if (status === 'unsolved') {
        append({ kind: 'error', text: "You haven't solved or revealed this one yet. Try a command, or type `reveal`." })
      } else {
        advanceRound()
      }
      return
    }

    if (checkMatch(round, raw)) {
      if (status === 'unsolved') setSolvedFlags((prev) => prev.map((s, i) => (i === roundIndex ? 'solved' : s)))
      append([
        { kind: 'success', text: '✓ Accepted.' },
        { kind: 'success', text: round.explanation },
        { kind: 'system', text: 'Type `next` or press the button below to continue.' },
      ])
    } else {
      append({ kind: 'error', text: "Not recognized for this task. Type `hint` if you're stuck, or `reveal` to see an example." })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
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
    const freshRounds = shuffled(TERMINAL_ROUNDS)
    setRounds(freshRounds)
    setRoundIndex(0)
    setInput('')
    setHistory([])
    setHistoryPos(null)
    setFinished(false)
    setSolvedFlags(freshRounds.map(() => 'unsolved'))
    setLog(briefingEntries(freshRounds[0], 0, freshRounds.length))
  }

  const colorFor: Record<LogEntry['kind'], string> = {
    briefing: 'text-slate-300',
    input: 'text-slate-100',
    success: 'text-emerald-400',
    error: 'text-rose-400',
    hint: 'text-amber-300',
    reveal: 'text-sky-300',
    system: 'text-slate-500',
  }

  if (finished) {
    const score = solvedFlags.filter((s) => s === 'solved').length
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link to="/games" className="text-sm text-slate-500 hover:text-slate-300">
          ← Back to games
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl">⌨️</span>
          <h1 className="text-2xl font-bold text-white">Terminal Range</h1>
        </div>
        <p className="mt-2 text-sm text-slate-400">Ten scenarios, ten real commands from the curriculum — no clicking, no multiple choice.</p>
        <div className="mt-8">
          <GameResult
            score={score}
            maxScore={rounds.length}
            scoreUnit="solved unaided"
            xpEarned={xpFromGameScore(score, rounds.length)}
            onReplay={replay}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link to="/games" className="text-sm text-slate-500 hover:text-slate-300">
        ← Back to games
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl">⌨️</span>
        <h1 className="text-2xl font-bold text-white">Terminal Range</h1>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        Type the actual command — this checks for the right idea and syntax, not an exact character match. Meta-commands: <code className="text-slate-300">hint</code>,{' '}
        <code className="text-slate-300">reveal</code>, <code className="text-slate-300">clear</code>, <code className="text-slate-300">next</code>.
      </p>

      <div
        className="mt-6 h-[420px] overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-sm thin-scroll"
        onClick={() => inputRef.current?.focus()}
      >
        {log.map((entry, i) => (
          <div key={i} className={`whitespace-pre-wrap ${colorFor[entry.kind]}`}>
            {entry.text}
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 text-slate-100">
          <span className="text-slate-500">{round.prompt}</span>
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

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          Round {roundIndex + 1}/{rounds.length} · solved unaided: {solvedFlags.filter((s) => s === 'solved').length}
        </span>
        {status !== 'unsolved' && (
          <button onClick={advanceRound} className="rounded-md bg-white/10 px-3 py-1.5 font-sans font-semibold text-slate-100 hover:bg-white/15">
            Next round →
          </button>
        )}
      </div>
    </div>
  )
}
