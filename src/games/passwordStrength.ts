const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'letmein', 'admin', 'welcome',
  'iloveyou', 'monkey', 'dragon', 'football', 'password1', 'abc123', '111111',
  'sunshine', 'princess', 'trustno1', 'baseball', 'shadow', 'superman',
])

const SEQUENTIAL_RUNS = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm']

function hasSequentialRun(pw: string, minRun = 4): boolean {
  const lower = pw.toLowerCase()
  return SEQUENTIAL_RUNS.some((seq) => {
    for (let i = 0; i <= seq.length - minRun; i++) {
      const forward = seq.slice(i, i + minRun)
      const backward = [...forward].reverse().join('')
      if (lower.includes(forward) || lower.includes(backward)) return true
    }
    return false
  })
}

function hasRepeatedRun(pw: string, minRun = 4): boolean {
  return new RegExp(`(.)\\1{${minRun - 1},}`).test(pw)
}

export interface Belt {
  id: string
  label: string
  color: string
}

export const BELTS: Belt[] = [
  { id: 'white', label: 'White Belt', color: '#e5e7eb' },
  { id: 'yellow', label: 'Yellow Belt', color: '#facc15' },
  { id: 'green', label: 'Green Belt', color: '#4ade80' },
  { id: 'brown', label: 'Brown Belt', color: '#a16207' },
  { id: 'black', label: 'Black Belt', color: '#0f172a' },
]

export interface PasswordAssessment {
  entropyBits: number
  crackTimeLabel: string
  beltsAchieved: number
  nextBeltRequirement: string | null
  flags: {
    tooCommon: boolean
    sequential: boolean
    repeated: boolean
  }
}

export function assessPassword(pw: string): PasswordAssessment {
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigit = /[0-9]/.test(pw)
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw)
  const classCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

  let poolSize = 0
  if (hasLower) poolSize += 26
  if (hasUpper) poolSize += 26
  if (hasDigit) poolSize += 10
  if (hasSymbol) poolSize += 32

  const entropyBits = pw.length > 0 && poolSize > 0 ? pw.length * Math.log2(poolSize) : 0

  const tooCommon = COMMON_PASSWORDS.has(pw.toLowerCase())
  const sequential = hasSequentialRun(pw)
  const repeated = hasRepeatedRun(pw)
  const clean = !tooCommon && !sequential && !repeated

  const guessesPerSecond = 1e10 // fast offline hash-cracking rig, conservative assumption
  const crackSeconds = poolSize > 0 ? Math.pow(2, entropyBits) / guessesPerSecond : 0
  const crackTimeLabel = tooCommon ? 'instantly (it\'s a known common password)' : formatDuration(crackSeconds)

  let beltsAchieved = 0
  let nextBeltRequirement: string | null = 'Reach at least 8 characters.'

  if (pw.length >= 8) {
    beltsAchieved = 1
    nextBeltRequirement = 'Add a second character type (letters + numbers, for example).'
  }
  if (beltsAchieved === 1 && classCount >= 2) {
    beltsAchieved = 2
    nextBeltRequirement = 'Reach 10+ characters using 3 character types (upper, lower, digit, or symbol).'
  }
  if (beltsAchieved === 2 && pw.length >= 10 && classCount >= 3) {
    beltsAchieved = 3
    nextBeltRequirement = 'Reach 12+ characters, and avoid common words or predictable patterns.'
  }
  if (beltsAchieved === 3 && pw.length >= 12 && clean) {
    beltsAchieved = 4
    nextBeltRequirement = 'Reach 14+ characters using all 4 character types, still with no predictable patterns.'
  }
  if (beltsAchieved === 4 && pw.length >= 14 && classCount === 4 && clean && entropyBits >= 70) {
    beltsAchieved = 5
    nextBeltRequirement = null
  }

  return { entropyBits, crackTimeLabel, beltsAchieved, nextBeltRequirement, flags: { tooCommon, sequential, repeated } }
}

function formatDuration(seconds: number): string {
  if (seconds < 1) return 'instantly'
  const units: [string, number][] = [
    ['second', 1],
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['month', 2629800],
    ['year', 31557600],
    ['century', 3155760000],
  ]
  let chosen = units[0]
  for (const unit of units) {
    if (seconds >= unit[1]) chosen = unit
  }
  const value = seconds / chosen[1]
  if (chosen[0] === 'century' && value > 1e6) return 'longer than the age of the universe'
  const rounded = value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(1)
  return `about ${rounded} ${chosen[0]}${value >= 2 ? 's' : ''}`
}
