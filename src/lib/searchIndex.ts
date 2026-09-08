import { allModules } from '../data/curriculum'
import { allMasteryModules } from '../data/masteryTrack'
import { GAME_DEFS } from './gamification'

export interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: string
  route: string
  keywords: string
}

const STATIC_PAGES: SearchItem[] = [
  { id: 'page-home', title: 'Home', subtitle: 'Course overview', category: 'Page', route: '/', keywords: 'home overview start' },
  { id: 'page-curriculum', title: 'Curriculum', subtitle: 'The 5-month core path, week by week', category: 'Page', route: '/curriculum', keywords: 'curriculum weeks core path job ready' },
  { id: 'page-mastery', title: 'Mastery Track', subtitle: 'Specializations beyond the core path', category: 'Page', route: '/mastery', keywords: 'mastery track specializations' },
  { id: 'page-games', title: 'Games', subtitle: 'Skill-drill games', category: 'Page', route: '/games', keywords: 'games drills practice' },
  { id: 'page-console', title: 'Console', subtitle: 'Persistent hands-on hacking sandbox', category: 'Page', route: '/console', keywords: 'console terminal hacking sandbox hack the box tryhackme' },
  { id: 'page-portfolio', title: 'Portfolio', subtitle: 'Your compiled deliverables and progress', category: 'Page', route: '/portfolio', keywords: 'portfolio resume deliverables' },
  { id: 'page-careers', title: 'Careers & Certs', subtitle: 'Roles, certifications, and pacing', category: 'Page', route: '/careers', keywords: 'careers certifications jobs certs comptia' },
  { id: 'page-progress', title: 'Progress', subtitle: 'XP, badges, and streak', category: 'Page', route: '/progress', keywords: 'progress xp badges streak level' },
  { id: 'page-privacy', title: 'Privacy Policy', subtitle: 'What data is (and isn\'t) collected', category: 'Page', route: '/privacy', keywords: 'privacy policy data localstorage cookies' },
  { id: 'page-terms', title: 'Terms of Use', subtitle: 'Authorized use, liability, and disclaimers', category: 'Page', route: '/terms', keywords: 'terms of use liability disclaimer legal' },
]

export function buildSearchIndex(): SearchItem[] {
  const core: SearchItem[] = allModules().map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: `Week ${m.week} · ${m.phaseTitle}`,
    category: 'Curriculum',
    route: `/module/${m.id}`,
    keywords: [m.title, m.tagline, ...m.topics].join(' '),
  }))

  const mastery: SearchItem[] = allMasteryModules().map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: m.trackTitle,
    category: 'Mastery',
    route: `/mastery/${m.id}`,
    keywords: [m.title, m.tagline, ...m.topics].join(' '),
  }))

  const games: SearchItem[] = GAME_DEFS.map((g) => ({
    id: g.id,
    title: g.title,
    subtitle: 'Skill-drill game',
    category: 'Game',
    route: g.route,
    keywords: [g.title, g.description].join(' '),
  }))

  return [...STATIC_PAGES, ...core, ...mastery, ...games]
}

function scoreItem(item: SearchItem, q: string, terms: string[]): number {
  const title = item.title.toLowerCase()
  const subtitle = item.subtitle.toLowerCase()
  const keywords = item.keywords.toLowerCase()

  if (title === q) return 1000
  let score = 0
  if (title.startsWith(q)) score += 200
  if (title.includes(q)) score += 100

  for (const t of terms) {
    if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title)) score += 40
    else if (title.includes(t)) score += 10
    if (subtitle.includes(t)) score += 5
    if (keywords.includes(t)) score += 1
  }
  return score
}

export function searchItems(index: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  return index
    .map((item) => ({ item, score: scoreItem(item, q, terms) }))
    .filter(({ item, score }) => {
      const haystack = `${item.title} ${item.subtitle} ${item.category} ${item.keywords}`.toLowerCase()
      return score > 0 && terms.every((t) => haystack.includes(t))
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(({ item }) => item)
}
