import { TOTAL_WEEKS, allModules } from '../data/curriculum'
import { TOTAL_MASTERY_MODULES } from '../data/masteryTrack'
import { CORE_QUIZZES, MASTERY_QUIZZES, QUIZ_LENGTH } from '../data/quizzes'
import { CORE_CHALLENGES, MASTERY_CHALLENGES, CHALLENGE_MAX_RATING } from '../data/challenges'

export interface GameDef {
  id: string
  title: string
  description: string
  emoji: string
  route: string
  maxScore: number
  scoreUnit: string
}

export const GAME_DEFS: GameDef[] = [
  {
    id: 'phishing-spotter',
    title: 'Phishing Spotter',
    description: 'Ten real-world-style emails. Spot the phish before you would have clicked it.',
    emoji: '🎣',
    route: '/games/phishing-spotter',
    maxScore: 10,
    scoreUnit: 'correct',
  },
  {
    id: 'packet-detective',
    title: 'Packet Detective',
    description: 'Read the traffic pattern, decide: normal or an indicator of compromise.',
    emoji: '📡',
    route: '/games/packet-detective',
    maxScore: 10,
    scoreUnit: 'correct',
  },
  {
    id: 'port-match',
    title: 'Port & Protocol Match',
    description: 'Match every common service to the port it actually runs on, against the clock.',
    emoji: '🔌',
    route: '/games/port-match',
    maxScore: 12,
    scoreUnit: 'matched',
  },
  {
    id: 'password-dojo',
    title: 'Password Dojo',
    description: 'Craft a password strong enough to earn every belt, from white to black.',
    emoji: '🥋',
    route: '/games/password-dojo',
    maxScore: 5,
    scoreUnit: 'belts',
  },
  {
    id: 'ir-drill',
    title: 'Incident Response Drill',
    description: 'A breach just happened. Put the NIST response phases in the right order, fast.',
    emoji: '🚨',
    route: '/games/ir-drill',
    maxScore: 6,
    scoreUnit: 'in order',
  },
  {
    id: 'breach-defend',
    title: 'Breach Simulator: Defend',
    description: 'Budget a limited set of defenses across the kill chain, then watch the attack unfold.',
    emoji: '🛡️',
    route: '/games/breach-defend',
    maxScore: 5,
    scoreUnit: 'stages secured',
  },
  {
    id: 'breach-attack',
    title: 'Breach Simulator: Find the Gap',
    description: 'A network has some hidden defenses in place. Find what still works, stage by stage.',
    emoji: '💥',
    route: '/games/breach-attack',
    maxScore: 5,
    scoreUnit: 'stages breached',
  },
  {
    id: 'terminal-range',
    title: 'Terminal Range',
    description: 'A real terminal, ten scenarios. Type the actual command — no clicking, no multiple choice.',
    emoji: '⌨️',
    route: '/games/terminal-range',
    maxScore: 10,
    scoreUnit: 'solved unaided',
  },
  {
    id: 'sim-incident',
    title: 'Sim: Incident Response',
    description: 'A real simulated filesystem and process list. Investigate a compromised box and clean it up for real.',
    emoji: '🕵️',
    route: '/games/sim-incident',
    maxScore: 3,
    scoreUnit: 'objectives',
  },
  {
    id: 'sim-recon',
    title: 'Sim: Recon Range',
    description: 'A real simulated network. Scan it, find the highest-risk host, and report it.',
    emoji: '📡',
    route: '/games/sim-recon',
    maxScore: 3,
    scoreUnit: 'objectives',
  },
  {
    id: 'sim-hardening',
    title: 'Sim: Hardening Sprint',
    description: 'A real simulated server with real permission bits and services. Fix all three findings.',
    emoji: '🔧',
    route: '/games/sim-hardening',
    maxScore: 3,
    scoreUnit: 'objectives',
  },
  {
    id: 'console-classes',
    title: 'Console: Vulnerability Classes',
    description: 'The persistent Console world — distinct real vulnerability classes actually exploited.',
    emoji: '🌐',
    route: '/console',
    maxScore: 9,
    scoreUnit: 'classes used',
  },
  {
    id: 'console-roots',
    title: 'Console: Hosts Rooted',
    description: 'The persistent Console world — hosts fully rooted via a real permission/sudo misconfiguration.',
    emoji: '🚩',
    route: '/console',
    maxScore: 14,
    scoreUnit: 'hosts rooted',
  },
]

export const XP_PER_CORE_MODULE = 100
export const XP_PER_MASTERY_MODULE = 150
export const XP_PER_GAME_MAX = 150
export const XP_PER_QUIZ_MAX = 60
export const XP_PER_CHALLENGE_MAX = 90

const CORE_QUIZ_IDS = Object.keys(CORE_QUIZZES)
const MASTERY_QUIZ_IDS = Object.keys(MASTERY_QUIZZES)
const QUIZZABLE_MODULE_COUNT = CORE_QUIZ_IDS.length + MASTERY_QUIZ_IDS.length

const CORE_CHALLENGE_IDS = Object.keys(CORE_CHALLENGES)
const MASTERY_CHALLENGE_IDS = Object.keys(MASTERY_CHALLENGES)
const CHALLENGEABLE_MODULE_COUNT = CORE_CHALLENGE_IDS.length + MASTERY_CHALLENGE_IDS.length

export const TOTAL_POSSIBLE_XP =
  TOTAL_WEEKS * XP_PER_CORE_MODULE +
  TOTAL_MASTERY_MODULES * XP_PER_MASTERY_MODULE +
  GAME_DEFS.length * XP_PER_GAME_MAX +
  QUIZZABLE_MODULE_COUNT * XP_PER_QUIZ_MAX +
  CHALLENGEABLE_MODULE_COUNT * XP_PER_CHALLENGE_MAX

export interface LevelDef {
  minPercent: number
  title: string
  blurb: string
}

export const LEVELS: LevelDef[] = [
  { minPercent: 0, title: 'Newcomer', blurb: 'Everyone starts here — the whole point is that it does not stay this way.' },
  { minPercent: 10, title: 'Script Kiddie', blurb: 'You can follow instructions. Next: understand why they work.' },
  { minPercent: 25, title: 'Security Aware', blurb: 'You now see risk in things you used to click without thinking.' },
  { minPercent: 40, title: 'Junior Analyst', blurb: 'You could credibly sit on a help desk and catch what most people miss.' },
  { minPercent: 55, title: 'SOC Analyst', blurb: 'The core path is mostly behind you. This is job-ready territory.' },
  { minPercent: 70, title: 'Security Practitioner', blurb: 'Deep into specialization now — this is real, applied skill.' },
  { minPercent: 85, title: 'Senior Practitioner', blurb: 'Very few self-taught learners get this far. Keep the reps honest.' },
  { minPercent: 100, title: 'Master', blurb: 'Mastery of everything this course can teach. Real mastery now continues on the job, one incident at a time.' },
]

export function xpFromScore(best: number, maxScore: number, xpMax: number): number {
  if (maxScore <= 0) return 0
  return Math.round((Math.min(best, maxScore) / maxScore) * xpMax)
}

export function xpFromGameScore(best: number, maxScore: number): number {
  return xpFromScore(best, maxScore, XP_PER_GAME_MAX)
}

export function xpFromQuizScore(best: number): number {
  return xpFromScore(best, QUIZ_LENGTH, XP_PER_QUIZ_MAX)
}

export function xpFromChallengeRating(rating: number): number {
  return xpFromScore(rating, CHALLENGE_MAX_RATING, XP_PER_CHALLENGE_MAX)
}

export interface XpBreakdown {
  coreXp: number
  masteryXp: number
  gamesXp: number
  quizXp: number
  challengeXp: number
  totalXp: number
  totalPossible: number
  percent: number
  level: LevelDef
  nextLevel: LevelDef | null
  percentToNextLevel: number
}

export function computeXp(
  coreCompleted: Set<string>,
  masteryCompleted: Set<string>,
  gameBest: Record<string, number>,
  quizBest: Record<string, number>,
  challengeBest: Record<string, number>,
): XpBreakdown {
  const coreXp = coreCompleted.size * XP_PER_CORE_MODULE
  const masteryXp = masteryCompleted.size * XP_PER_MASTERY_MODULE
  const gamesXp = GAME_DEFS.reduce((sum, g) => sum + xpFromGameScore(gameBest[g.id] ?? 0, g.maxScore), 0)
  const quizXp = Object.values(quizBest).reduce((sum, best) => sum + xpFromQuizScore(best), 0)
  const challengeXp = Object.values(challengeBest).reduce((sum, rating) => sum + xpFromChallengeRating(rating), 0)
  const totalXp = coreXp + masteryXp + gamesXp + quizXp + challengeXp
  const percent = TOTAL_POSSIBLE_XP === 0 ? 0 : Math.round((totalXp / TOTAL_POSSIBLE_XP) * 100)

  let level = LEVELS[0]
  let nextLevel: LevelDef | null = LEVELS[1] ?? null
  for (let i = 0; i < LEVELS.length; i++) {
    if (percent >= LEVELS[i].minPercent) {
      level = LEVELS[i]
      nextLevel = LEVELS[i + 1] ?? null
    }
  }

  const percentToNextLevel = nextLevel
    ? Math.round(((percent - level.minPercent) / (nextLevel.minPercent - level.minPercent)) * 100)
    : 100

  return { coreXp, masteryXp, gamesXp, quizXp, challengeXp, totalXp, totalPossible: TOTAL_POSSIBLE_XP, percent, level, nextLevel, percentToNextLevel }
}

export interface Badge {
  id: string
  title: string
  description: string
  emoji: string
  earned: boolean
}

export function computeBadges(
  coreCompleted: Set<string>,
  masteryCompleted: Set<string>,
  gameBest: Record<string, number>,
  gamePlays: Record<string, number>,
  quizBest: Record<string, number>,
  challengeBest: Record<string, number>,
  longestStreak: number,
): Badge[] {
  const modules = allModules()
  const byPhase = (phaseId: string) => modules.filter((m) => m.phaseId === phaseId)
  const phaseComplete = (phaseId: string) => byPhase(phaseId).every((m) => coreCompleted.has(m.id))

  const gamesPlayedAll = GAME_DEFS.every((g) => (gamePlays[g.id] ?? 0) > 0)
  const gamesMastered = GAME_DEFS.every((g) => (gameBest[g.id] ?? 0) >= g.maxScore * 0.8)
  const coreQuizzesChecked = CORE_QUIZ_IDS.every((id) => quizBest[id] !== undefined)
  const perfectQuizCount = Object.values(quizBest).filter((v) => v >= QUIZ_LENGTH).length
  const coreChallengesAttempted = CORE_CHALLENGE_IDS.every((id) => challengeBest[id] !== undefined)
  const allChallengesAttempted = [...CORE_CHALLENGE_IDS, ...MASTERY_CHALLENGE_IDS].every((id) => challengeBest[id] !== undefined)
  const nailedItCount = Object.values(challengeBest).filter((v) => v >= CHALLENGE_MAX_RATING).length

  return [
    { id: 'first-blood', title: 'First Blood', description: 'Complete your first weekly module.', emoji: '🩸', earned: coreCompleted.size >= 1 },
    { id: 'network-systems', title: 'Wire Reader', description: 'Finish the Networking & Systems Security phase.', emoji: '🌐', earned: phaseComplete('network-systems') },
    { id: 'offensive', title: 'Red Teamer', description: 'Finish the Offensive Security Fundamentals phase.', emoji: '🗡️', earned: phaseComplete('offensive') },
    { id: 'defensive', title: 'Blue Teamer', description: 'Finish the Defensive Security & Incident Response phase.', emoji: '🛡️', earned: phaseComplete('defensive') },
    { id: 'incident-commander', title: 'Incident Commander', description: 'Complete Week 16 — the full IR lifecycle.', emoji: '🚒', earned: coreCompleted.has('w16') },
    { id: 'cloud-native', title: 'Cloud Native', description: 'Complete the cloud security module.', emoji: '☁️', earned: coreCompleted.has('w18') },
    { id: 'core-complete', title: 'Job Ready', description: 'Complete the entire 20-week core path.', emoji: '🎓', earned: coreCompleted.size >= TOTAL_WEEKS },
    { id: 'mastery-starter', title: 'Beyond the Basics', description: 'Complete your first Mastery Track module.', emoji: '🔬', earned: masteryCompleted.size >= 1 },
    { id: 'mastery-complete', title: 'True Mastery', description: 'Complete every Mastery Track module.', emoji: '👑', earned: masteryCompleted.size >= TOTAL_MASTERY_MODULES },
    { id: 'gamer', title: 'Hands-On Learner', description: 'Play every mini-game at least once.', emoji: '🎮', earned: gamesPlayedAll },
    { id: 'high-scorer', title: 'Sharp Shooter', description: 'Score 80%+ on every mini-game.', emoji: '🎯', earned: gamesMastered },
    { id: 'quiz-checked', title: 'Checked Understanding', description: 'Take the knowledge check on every core-path module.', emoji: '✅', earned: coreQuizzesChecked },
    { id: 'quiz-ace', title: 'Perfect Recall', description: 'Score 100% on at least 10 knowledge checks.', emoji: '🧠', earned: perfectQuizCount >= 10 },
    { id: 'challenge-starter', title: 'Doer, Not Just Reader', description: 'Complete a scenario challenge on every core-path module.', emoji: '🛠️', earned: coreChallengesAttempted },
    { id: 'challenge-complete', title: 'Applied Everything', description: 'Complete a scenario challenge on every core and mastery module.', emoji: '🏗️', earned: allChallengesAttempted },
    { id: 'challenge-ace', title: 'Nailed It', description: 'Self-rate "Nailed it" on at least 15 scenario challenges.', emoji: '💯', earned: nailedItCount >= 15 },
    { id: 'streak-7', title: 'Week-Long Streak', description: 'Show up 7 days in a row.', emoji: '🔥', earned: longestStreak >= 7 },
    { id: 'streak-30', title: 'Relentless', description: 'Show up 30 days in a row.', emoji: '⚡', earned: longestStreak >= 30 },
  ]
}
