import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConsoleWorld } from '../state/ConsoleWorldContext'

export default function IncidentToast() {
  const { activeIncident, toastDismissed, dismissToast } = useConsoleWorld()
  const navigate = useNavigate()
  const expiresAt = activeIncident?.incidentExpiresAt ?? null
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!expiresAt) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  if (!activeIncident || toastDismissed || !expiresAt) return null

  const secondsLeft = Math.max(0, Math.round((expiresAt - now) / 1000))
  const mm = Math.floor(secondsLeft / 60)
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-rose-400/40 bg-[#0a0c10] p-4 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300">🚨 Live incident</span>
        <button onClick={dismissToast} className="text-slate-500 hover:text-slate-300" aria-label="Dismiss">
          ✕
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-200">
        Suspicious activity detected on <strong>{activeIncident.hostname}</strong>.
      </p>
      <p className="mt-1 text-xs text-slate-500">{activeIncident.banner}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-sm text-rose-300">
          {mm}:{ss} left
        </span>
        <button
          onClick={() => navigate('/console')}
          className="rounded-md bg-rose-400/90 px-3 py-1.5 text-xs font-semibold text-black hover:bg-rose-300"
        >
          Respond now →
        </button>
      </div>
    </div>
  )
}
