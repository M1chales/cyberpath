import { Link } from 'react-router-dom'
import { TOTAL_WEEKS } from '../data/curriculum'

const roles = [
  {
    title: 'SOC Analyst (Blue Team)',
    weeks: 'Weeks 5–8, 13–16',
    description:
      'Monitors alerts, triages incidents, and is usually the very first human to notice something is wrong. The most common entry-level security job.',
  },
  {
    title: 'Incident Responder / DFIR',
    weeks: 'Weeks 13–16',
    description:
      'Called in once something bad has already happened: contains the damage, figures out what occurred, and helps the organization recover.',
  },
  {
    title: 'Penetration Tester (Red Team)',
    weeks: 'Weeks 9–12',
    description:
      'Authorized attacker who finds the holes before criminals do. Requires strong fundamentals plus deliberate offensive practice.',
  },
  {
    title: 'Cloud / AppSec Engineer',
    weeks: 'Weeks 10, 17–18',
    description:
      'Builds security into applications and cloud infrastructure from the start, rather than bolting it on after a breach.',
  },
  {
    title: 'GRC Analyst',
    weeks: 'Week 19',
    description:
      'Translates security into policy, risk, and compliance language that leadership and regulators actually act on.',
  },
  {
    title: 'The "first call" generalist',
    weeks: 'All 20 weeks',
    description:
      "Not a formal job title — the person their family, friends, or small business calls first when something looks wrong. Every phase of this course builds toward this by design.",
  },
]

export default function Careers() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Careers, certifications &amp; pacing</h1>
      <p className="mt-3 text-slate-400">
        This course is built to do two things at once: make anyone meaningfully safer online, and give people who
        want a career a real on-ramp into the industry — for free.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Where each role connects to the curriculum</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <div key={role.title} className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold text-slate-100">{role.title}</h3>
              <p className="mt-1 font-mono text-xs text-slate-500">{role.weeks}</p>
              <p className="mt-2 text-sm text-slate-400">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-white">Certification map</h2>
        <p className="mt-2 text-sm text-slate-400">
          Certifications are optional and cost money to sit — this course itself is free and covers the knowledge
          for all of these. Treat the exam as a way to prove what you already know once you're ready.
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
          <li>
            <strong>CompTIA Security+</strong> — broadly covered across Weeks 1–8 and 19; the standard entry-level
            security certification.
          </li>
          <li>
            <strong>CompTIA CySA+</strong> — covered across Weeks 13–16; focused on detection and response.
          </li>
          <li>
            <strong>CompTIA PenTest+</strong> — covered across Weeks 9–12; focused on ethical offensive testing.
          </li>
          <li>
            <strong>Cloud provider security fundamentals</strong> (AWS/Azure/GCP) — covered in Week 18.
          </li>
        </ul>
      </section>

      <section className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold text-white">How the 5-month timeline works</h2>
        <p className="mt-2 text-sm text-slate-400">
          The core path is {TOTAL_WEEKS} weekly modules. At one module per week, that's about 4.6 months — leaving
          real buffer inside a 5-month window for a slow week, a harder lab, or extra certification study.
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
          <li>Budget roughly 10–15 focused hours per week: reading, hands-on labs, and the weekly deliverable.</li>
          <li>Don't skip the hands-on labs — they're what actually builds the skill, not the reading.</li>
          <li>If a week runs long, protect the pace by trimming reading, never by skipping the lab or deliverable.</li>
          <li>Keep every deliverable (reports, scripts, write-ups) — by Week 20 they become your portfolio.</li>
        </ul>
        <Link to="/curriculum" className="mt-5 inline-block font-semibold text-emerald-300 hover:text-emerald-200">
          Start the curriculum →
        </Link>
      </section>

      <section className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold text-white">Prove it somewhere a hiring manager can check</h2>
        <p className="mt-2 text-sm text-slate-400">
          Deliverables and Console roots from this app collect automatically on your{' '}
          <Link to="/portfolio" className="text-emerald-300 hover:text-emerald-200">
            Portfolio page
          </Link>{' '}
          — copy it into a resume or write-up. But this app runs entirely in your browser, so nothing here is
          independently verifiable by anyone else. The next step that is: a public profile on a platform a recruiter
          can pull up themselves.
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
          <li>
            <a href="https://www.hackthebox.com/" target="_blank" rel="noreferrer" className="font-semibold text-emerald-300 underline decoration-dotted hover:text-emerald-200">
              HackTheBox ↗
            </a>{' '}
            — public rank and machine/challenge completions, the closest thing the industry has to a verifiable
            offensive-security transcript.
          </li>
          <li>
            <a href="https://tryhackme.com/" target="_blank" rel="noreferrer" className="font-semibold text-emerald-300 underline decoration-dotted hover:text-emerald-200">
              TryHackMe ↗
            </a>{' '}
            — structured, guided rooms; a good bridge once the Console's unguided style feels comfortable.
          </li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Free tiers exist on both. The goal isn't to abandon this course — it's to point real, hard-won skill at a
          public scoreboard once you have it.
        </p>
      </section>

      <section className="mt-12 rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/5 p-6">
        <h2 className="text-xl font-bold text-white">What happens after month 5?</h2>
        <p className="mt-2 text-sm text-slate-300">
          The core path makes you job-ready. Real mastery — the kind where people trust you as their first call —
          keeps building for years afterward, through real incidents, specialization, and reputation. The{' '}
          <Link to="/mastery" className="text-fuchsia-300 underline decoration-dotted hover:text-fuchsia-200">
            Mastery Track
          </Link>{' '}
          maps out exactly what that looks like across six specializations, plus the ongoing habits (CTFs, bug
          bounty, community, teaching) that build the reputation no course can hand you directly.
        </p>
        <Link to="/mastery" className="mt-4 inline-block font-semibold text-fuchsia-300 hover:text-fuchsia-200">
          Explore the Mastery Track →
        </Link>
      </section>
    </div>
  )
}
