export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Terms of Use</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <div className="mt-8 rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/5 p-5 text-sm text-fuchsia-100">
        This site teaches real offensive and defensive security techniques. This page exists mainly to make one
        thing explicit: what you learn here is for authorized, lawful use only.
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300">
        <section>
          <h2 className="text-lg font-semibold text-white">Educational purpose and authorized use only</h2>
          <p className="mt-2">
            Everything here — the curriculum, the Mastery Track, the games, and the Console sandbox — is provided for
            education and legitimate skill-building only. The Console runs entirely against a procedurally generated,
            fictional environment that lives only in your own browser; it is not a real network and never touches any
            system outside this app. That said, the actual techniques taught (SQL injection, command injection,
            privilege escalation, password attacks, network scanning, and others) are real, and are illegal to use
            against any system you do not own or do not have explicit, written authorization to test. You are solely
            responsible for how you apply what you learn here. Never use these techniques against systems, networks,
            or accounts you don't own or aren't authorized to test.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">No warranty, provided "as is"</h2>
          <p className="mt-2">
            This is a free, independently built educational project. The content is provided "as is," without
            warranty of any kind, express or implied, including but not limited to accuracy, completeness, or
            fitness for a particular purpose. While real effort has gone into technical accuracy, this content has
            not been reviewed by an accredited certification body or guaranteed correct by a professional audit.
            Nothing here is a substitute for an accredited certification, a formal degree program, or verified
            professional work experience.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">No guarantee of outcomes</h2>
          <p className="mt-2">
            Completing this course, the Mastery Track, or any amount of Console activity does not guarantee
            employment, a certification pass, or any specific career outcome. It's a genuine, free effort to teach
            real skills — what you do with them, and how far you take them, is up to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, the creators of this site are not liable for any damages or
            losses — direct, indirect, incidental, or consequential — arising from your use of this site or your
            application of anything taught here, including any misuse of offensive security techniques against
            systems you were not authorized to test.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Content and ownership</h2>
          <p className="mt-2">
            The curriculum text, lesson content, and site design are provided for your personal, non-commercial
            learning use. This is a hobby/educational project, not a commercial product with a formal license grant
            beyond that.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Changes</h2>
          <p className="mt-2">
            These terms may be updated as the site evolves. Continuing to use the site after a change means you
            accept the current version.
          </p>
        </section>
      </div>
    </div>
  )
}
