import { PRIVACY_SECTIONS } from '../data/legalText'

export default function Privacy() {
  const [summary, ...sections] = PRIVACY_SECTIONS

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <div className="mt-8 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-5 text-sm text-emerald-100">
        {summary.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-white">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-2">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-600">
        This same text is available from the Console terminal by typing <code className="rounded bg-white/10 px-1 py-0.5">privacy</code>.
      </p>
    </div>
  )
}
