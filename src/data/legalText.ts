// Single source of truth for the Privacy Policy and Terms of Use — both the web pages
// (src/pages/Privacy.tsx, src/pages/Terms.tsx) and the Console's `privacy`/`terms` commands
// render from this same data, so the two surfaces can never drift out of sync with each other.
export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'The short version',
    paragraphs: [
      "This site doesn't have a backend, doesn't have accounts, and doesn't collect anything. Everything below just explains what that means in practice.",
    ],
  },
  {
    heading: 'What we collect',
    paragraphs: [
      'Nothing. There is no account system, no server-side database, no analytics, and no tracking scripts of any kind. We — the people who built this site — never receive your progress, your Console world, your quiz answers, or anything else you do here. There is nothing for us to collect, because there is no mechanism in this app that sends data anywhere.',
    ],
  },
  {
    heading: "What's stored, and where",
    paragraphs: [
      "Your course progress, badges, XP, and the Console's persistent world are saved using your browser's localStorage — a standard browser feature that keeps small amounts of data on your own device, tied to this site's address. It never leaves your browser on its own. Clearing your browser's site data, using private/incognito browsing, or switching to a different browser or device will reset it, since there is no account to recover it from. See the Progress page in the app for a backup/restore tool if you want to keep a copy of your own data.",
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: ['This site does not set cookies.'],
  },
  {
    heading: 'Third-party links',
    paragraphs: [
      "Some pages link out to external sites (HackTheBox, TryHackMe, MITRE ATT&CK, NIST, OWASP, and similar reference and practice resources). Those are independent sites with their own privacy practices — this policy only covers this site itself, and clicking an outbound link is between you and that site.",
    ],
  },
  {
    heading: 'Hosting',
    paragraphs: [
      'This site is served as static files by our hosting provider. Like essentially any web host, they may log basic technical request data (such as IP address and request timestamps) as part of normal infrastructure operation — that\'s standard web server behavior, not something this app configures, requests, or has access to.',
    ],
  },
  {
    heading: "Children's privacy",
    paragraphs: [
      "Since no personal information is collected from anyone, regardless of age, there is nothing here that implicates children's privacy laws (such as COPPA) in the way they'd apply to a site that actually gathers user data.",
    ],
  },
  {
    heading: 'Changes to this policy',
    paragraphs: [
      "If this site's architecture ever changes to actually collect data (an account system, analytics, etc.), this page will be updated to reflect that honestly before such a change ships.",
    ],
  },
]

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Summary',
    paragraphs: [
      'This site teaches real offensive and defensive security techniques. This page exists mainly to make one thing explicit: what you learn here is for authorized, lawful use only.',
    ],
  },
  {
    heading: 'Educational purpose and authorized use only',
    paragraphs: [
      'Everything here — the curriculum, the Mastery Track, the games, and the Console sandbox — is provided for education and legitimate skill-building only. The Console runs entirely against a procedurally generated, fictional environment that lives only in your own browser; it is not a real network and never touches any system outside this app. That said, the actual techniques taught (SQL injection, command injection, privilege escalation, password attacks, network scanning, and others) are real, and are illegal to use against any system you do not own or do not have explicit, written authorization to test. You are solely responsible for how you apply what you learn here. Never use these techniques against systems, networks, or accounts you don\'t own or aren\'t authorized to test.',
    ],
  },
  {
    heading: 'No warranty, provided "as is"',
    paragraphs: [
      'This is a free, independently built educational project. The content is provided "as is," without warranty of any kind, express or implied, including but not limited to accuracy, completeness, or fitness for a particular purpose. While real effort has gone into technical accuracy, this content has not been reviewed by an accredited certification body or guaranteed correct by a professional audit. Nothing here is a substitute for an accredited certification, a formal degree program, or verified professional work experience.',
    ],
  },
  {
    heading: 'No guarantee of outcomes',
    paragraphs: [
      "Completing this course, the Mastery Track, or any amount of Console activity does not guarantee employment, a certification pass, or any specific career outcome. It's a genuine, free effort to teach real skills — what you do with them, and how far you take them, is up to you.",
    ],
  },
  {
    heading: 'Limitation of liability',
    paragraphs: [
      'To the fullest extent permitted by law, the creators of this site are not liable for any damages or losses — direct, indirect, incidental, or consequential — arising from your use of this site or your application of anything taught here, including any misuse of offensive security techniques against systems you were not authorized to test.',
    ],
  },
  {
    heading: 'Content and ownership',
    paragraphs: [
      'The curriculum text, lesson content, and site design are provided for your personal, non-commercial learning use. This is a hobby/educational project, not a commercial product with a formal license grant beyond that.',
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'These terms may be updated as the site evolves. Continuing to use the site after a change means you accept the current version.',
    ],
  },
]
