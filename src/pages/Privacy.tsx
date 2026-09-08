import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <div className="mt-8 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-5 text-sm text-emerald-100">
        The short version: this site doesn't have a backend, doesn't have accounts, and doesn't collect anything.
        Everything below just explains what that means in practice.
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300">
        <section>
          <h2 className="text-lg font-semibold text-white">What we collect</h2>
          <p className="mt-2">
            Nothing. There is no account system, no server-side database, no analytics, and no tracking scripts of
            any kind. We — the people who built this site — never receive your progress, your Console world, your
            quiz answers, or anything else you do here. There is nothing for us to collect, because there is no
            mechanism in this app that sends data anywhere.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">What's stored, and where</h2>
          <p className="mt-2">
            Your course progress, badges, XP, and the Console's persistent world are saved using your browser's{' '}
            <code className="rounded bg-white/10 px-1 py-0.5 text-xs">localStorage</code> — a standard browser
            feature that keeps small amounts of data on your own device, tied to this site's address. It never
            leaves your browser on its own. Clearing your browser's site data, using private/incognito browsing, or
            switching to a different browser or device will reset it, since there is no account to recover it from.
            See the <Link to="/progress" className="text-emerald-300 underline decoration-dotted hover:text-emerald-200">Progress page</Link>{' '}
            for a backup/restore tool if you want to keep a copy of your own data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Cookies</h2>
          <p className="mt-2">This site does not set cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Third-party links</h2>
          <p className="mt-2">
            Some pages link out to external sites (HackTheBox, TryHackMe, MITRE ATT&CK, NIST, OWASP, and similar
            reference and practice resources). Those are independent sites with their own privacy practices — this
            policy only covers this site itself, and clicking an outbound link is between you and that site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Hosting</h2>
          <p className="mt-2">
            This site is served as static files by our hosting provider. Like essentially any web host, they may log
            basic technical request data (such as IP address and request timestamps) as part of normal infrastructure
            operation — that's standard web server behavior, not something this app configures, requests, or has
            access to.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Children's privacy</h2>
          <p className="mt-2">
            Since no personal information is collected from anyone, regardless of age, there is nothing here that
            implicates children's privacy laws (such as COPPA) in the way they'd apply to a site that actually
            gathers user data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Changes to this policy</h2>
          <p className="mt-2">
            If this site's architecture ever changes to actually collect data (an account system, analytics, etc.),
            this page will be updated to reflect that honestly before such a change ships.
          </p>
        </section>
      </div>
    </div>
  )
}
