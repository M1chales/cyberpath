import { useState } from 'react'
import GameShell, { GameResult } from '../components/GameShell'
import { xpFromGameScore } from '../lib/gamification'
import { useAppState } from '../state/AppStateContext'
import { assessPassword, BELTS } from './passwordStrength'

const MAX_SCORE = BELTS.length

export default function PasswordDojo() {
  const { recordGameResult } = useAppState()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [locked, setLocked] = useState<number | null>(null)

  const assessment = assessPassword(password)

  function lockIn() {
    setLocked(assessment.beltsAchieved)
    recordGameResult('password-dojo', assessment.beltsAchieved)
  }

  function replay() {
    setPassword('')
    setLocked(null)
  }

  if (locked !== null) {
    return (
      <GameShell emoji="🥋" title="Password Dojo" instructions="Craft a password strong enough to earn every belt.">
        <GameResult score={locked} maxScore={MAX_SCORE} scoreUnit="belts earned" xpEarned={xpFromGameScore(locked, MAX_SCORE)} onReplay={replay} />
      </GameShell>
    )
  }

  return (
    <GameShell
      emoji="🥋"
      title="Password Dojo"
      instructions="Type a password below (it never leaves your browser). Earn belts as it gets stronger, then lock it in for your score."
    >
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a practice password..."
          className="w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-3 font-mono text-slate-100 outline-none focus:border-emerald-400/50"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
        >
          {show ? 'hide' : 'show'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {BELTS.map((belt, i) => {
          const earned = assessment.beltsAchieved > i
          return (
            <div
              key={belt.id}
              className="rounded-md border p-2 text-center text-[11px] font-semibold transition-colors"
              style={{
                borderColor: earned ? `${belt.color}88` : 'rgba(255,255,255,0.1)',
                backgroundColor: earned ? `${belt.color}22` : 'transparent',
                color: earned ? belt.color : '#64748b',
              }}
            >
              {belt.label}
            </div>
          )
        })}
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm">
        <p className="text-slate-300">
          Estimated crack time: <strong className="text-slate-100">{password ? assessment.crackTimeLabel : '—'}</strong>
        </p>
        {assessment.flags.tooCommon && <p className="mt-1 text-rose-300">This is one of the most common passwords in the world.</p>}
        {assessment.flags.sequential && <p className="mt-1 text-rose-300">Contains a predictable sequential run (like "1234" or "qwerty").</p>}
        {assessment.flags.repeated && <p className="mt-1 text-rose-300">Contains a repeated-character run (like "aaaa").</p>}
        {assessment.nextBeltRequirement && <p className="mt-2 text-slate-500">Next belt: {assessment.nextBeltRequirement}</p>}
      </div>

      <button
        onClick={lockIn}
        disabled={password.length === 0}
        className="mt-5 w-full rounded-md bg-emerald-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Lock in this password
      </button>
      <p className="mt-3 text-center text-xs text-slate-600">
        Never type a password you actually use anywhere — practice with a made-up one.
      </p>
    </GameShell>
  )
}
