import { CORE_PHASE1_CHALLENGES } from './core-phase1'
import { CORE_PHASE2_CHALLENGES } from './core-phase2'
import { CORE_PHASE3_CHALLENGES } from './core-phase3'
import { CORE_PHASE4_CHALLENGES } from './core-phase4'
import { CORE_PHASE5_CHALLENGES } from './core-phase5'
import { MASTERY_BLUETEAM_CHALLENGES } from './mastery-blueteam'
import { MASTERY_OFFENSE_CHALLENGES } from './mastery-offense'
import { MASTERY_FORENSICS_CHALLENGES } from './mastery-forensics'
import { MASTERY_CLOUD_CHALLENGES } from './mastery-cloud'
import { MASTERY_GRC_CHALLENGES } from './mastery-grc'
import type { Challenge } from './types'

export type { Challenge } from './types'

export const CORE_CHALLENGES: Record<string, Challenge> = {
  ...CORE_PHASE1_CHALLENGES,
  ...CORE_PHASE2_CHALLENGES,
  ...CORE_PHASE3_CHALLENGES,
  ...CORE_PHASE4_CHALLENGES,
  ...CORE_PHASE5_CHALLENGES,
}

export const MASTERY_CHALLENGES: Record<string, Challenge> = {
  ...MASTERY_BLUETEAM_CHALLENGES,
  ...MASTERY_OFFENSE_CHALLENGES,
  ...MASTERY_FORENSICS_CHALLENGES,
  ...MASTERY_CLOUD_CHALLENGES,
  ...MASTERY_GRC_CHALLENGES,
}

export function getCoreChallenge(id: string): Challenge | undefined {
  return CORE_CHALLENGES[id]
}

export function getMasteryChallenge(id: string): Challenge | undefined {
  return MASTERY_CHALLENGES[id]
}

// Self-assessment rating scale used after revealing the model answer.
export const CHALLENGE_MAX_RATING = 2
