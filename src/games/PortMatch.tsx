import { useState } from 'react'
import GameShell, { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { PORT_PAIRS } from './gameData'

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const MAX_SCORE = PORT_PAIRS.length

export default function PortMatch() {
  const { recordGameResult } = useAppState()
  const [ports, setPorts] = useState(() => shuffled(PORT_PAIRS.map((p) => p.port)))
  const [services, setServices] = useState(() => shuffled(PORT_PAIRS.map((p) => p.service)))

  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selectedPort, setSelectedPort] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [wrongFlash, setWrongFlash] = useState<{ port: string; service: string } | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [finished, setFinished] = useState(false)

  const finishIfDone = (nextMatched: Set<string>) => {
    if (nextMatched.size === PORT_PAIRS.length) {
      setFinished(true)
      recordGameResult('port-match', PORT_PAIRS.length)
    }
  }

  function pickPort(port: string) {
    if (matched.has(port) || wrongFlash) return
    setSelectedPort(port)
    if (selectedService) evaluate(port, selectedService)
  }

  function pickService(service: string) {
    if (wrongFlash) return
    const alreadyMatched = PORT_PAIRS.some((p) => p.service === service && matched.has(p.port))
    if (alreadyMatched) return
    setSelectedService(service)
    if (selectedPort) evaluate(selectedPort, service)
  }

  function evaluate(port: string, service: string) {
    const correct = PORT_PAIRS.some((p) => p.port === port && p.service === service)
    if (correct) {
      const next = new Set(matched)
      next.add(port)
      setMatched(next)
      setSelectedPort(null)
      setSelectedService(null)
      finishIfDone(next)
    } else {
      setMistakes((m) => m + 1)
      setWrongFlash({ port, service })
      setTimeout(() => {
        setWrongFlash(null)
        setSelectedPort(null)
        setSelectedService(null)
      }, 500)
    }
  }

  function replay() {
    setPorts(shuffled(PORT_PAIRS.map((p) => p.port)))
    setServices(shuffled(PORT_PAIRS.map((p) => p.service)))
    setMatched(new Set())
    setSelectedPort(null)
    setSelectedService(null)
    setWrongFlash(null)
    setMistakes(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <GameShell
        emoji="🔌"
        title="Port & Protocol Match"
        instructions="Match every common service to the port it actually runs on."
      >
        <GameResult
          score={PORT_PAIRS.length}
          maxScore={MAX_SCORE}
          scoreUnit={`matched, ${mistakes} mistake${mistakes === 1 ? '' : 's'}`}
          xpEarned={xpFromGameScore(PORT_PAIRS.length, MAX_SCORE)}
          onReplay={replay}
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      emoji="🔌"
      title="Port & Protocol Match"
      instructions="Click a port, then click the service that runs on it. Wrong pairs flash red and reset — no penalty besides your mistake count."
    >
      <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
        <span>
          Matched {matched.size} / {PORT_PAIRS.length}
        </span>
        <span>Mistakes: {mistakes}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {ports.map((port) => {
            const isMatched = matched.has(port)
            const isSelected = selectedPort === port
            const isWrong = wrongFlash?.port === port
            return (
              <button
                key={port}
                disabled={isMatched}
                onClick={() => pickPort(port)}
                className={`w-full rounded-md border px-3 py-2 text-left font-mono text-sm transition-colors ${
                  isMatched
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300/60'
                    : isWrong
                      ? 'border-rose-400/60 bg-rose-400/10 text-rose-300'
                      : isSelected
                        ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                        : 'border-white/10 bg-white/[0.02] text-slate-200 hover:border-white/25'
                }`}
              >
                {port}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {services.map((service) => {
            const isMatched = PORT_PAIRS.some((p) => p.service === service && matched.has(p.port))
            const isSelected = selectedService === service
            const isWrong = wrongFlash?.service === service
            return (
              <button
                key={service}
                disabled={isMatched}
                onClick={() => pickService(service)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  isMatched
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300/60'
                    : isWrong
                      ? 'border-rose-400/60 bg-rose-400/10 text-rose-300'
                      : isSelected
                        ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                        : 'border-white/10 bg-white/[0.02] text-slate-200 hover:border-white/25'
                }`}
              >
                {service}
              </button>
            )
          })}
        </div>
      </div>
    </GameShell>
  )
}
