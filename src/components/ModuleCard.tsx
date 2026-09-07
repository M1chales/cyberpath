import { Link } from 'react-router-dom'
import type { CoreModule } from '../data/types'

interface Props {
  module: CoreModule
  color: string
  done: boolean
}

export default function ModuleCard({ module, color, done }: Props) {
  return (
    <Link
      to={`/module/${module.id}`}
      className="group flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Week {module.week}</span>
        {done && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            ✓ done
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-100 group-hover:text-white">{module.title}</h3>
      <p className="text-sm text-slate-400">{module.tagline}</p>
      <div className="mt-1 h-1 w-8 rounded-full" style={{ backgroundColor: color }} />
    </Link>
  )
}
