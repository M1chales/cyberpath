import type { Lesson } from '../data/lessons/types'

export default function LessonContent({ lesson, accent = '#34d399' }: { lesson: Lesson; accent?: string }) {
  return (
    <div className="mt-6">
      {lesson.builtOn && lesson.builtOn.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="uppercase tracking-wider">Builds on</span>
          {lesson.builtOn.map((b) => (
            <span key={b} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-slate-400">
              {b}
            </span>
          ))}
        </div>
      )}

      <p className="text-[15px] leading-relaxed text-slate-300">{lesson.intro}</p>

      {lesson.sections.length > 1 && (
        <nav className="mt-5 rounded-md border border-white/10 bg-white/[0.02] p-3 text-sm">
          <span className="text-xs uppercase tracking-wider text-slate-500">In this lesson</span>
          <ol className="mt-2 space-y-1">
            {lesson.sections.map((s, i) => (
              <li key={s.heading}>
                <a href={`#section-${i}`} className="text-slate-400 hover:text-emerald-300">
                  {i + 1}. {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-6 space-y-8">
        {lesson.sections.map((section, i) => (
          <section key={section.heading} id={`section-${i}`} className="scroll-mt-20">
            <h3 className="text-lg font-semibold text-white">{section.heading}</h3>
            <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-slate-300">
              {section.paragraphs.map((p, pi) => (
                <p key={pi}>{p}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-slate-300">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {section.code && (
              <div className="mt-3">
                {section.codeLabel && <p className="mb-1 text-xs text-slate-500">{section.codeLabel}</p>}
                <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-300">
                  {section.code}
                </pre>
              </div>
            )}
            {section.callout && (
              <div className="mt-3 rounded-md border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm">
                <span className="font-semibold text-emerald-300">{section.callout.label}: </span>
                <span className="text-slate-300">{section.callout.text}</span>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-lg border p-4" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0d` }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
          Key takeaways
        </span>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {lesson.takeaways.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
