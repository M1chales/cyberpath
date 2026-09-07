import { CORE_PHASE1_LESSONS } from './core-phase1'
import { CORE_PHASE2_LESSONS } from './core-phase2'
import { CORE_PHASE3_LESSONS } from './core-phase3'
import { CORE_PHASE4_LESSONS } from './core-phase4'
import { CORE_PHASE5_LESSONS } from './core-phase5'
import { MASTERY_BLUETEAM_LESSONS } from './mastery-blueteam'
import { MASTERY_OFFENSE_LESSONS } from './mastery-offense'
import { MASTERY_FORENSICS_LESSONS } from './mastery-forensics'
import { MASTERY_CLOUD_LESSONS } from './mastery-cloud'
import { MASTERY_GRC_LESSONS } from './mastery-grc'
import type { Lesson } from './types'

export type { Lesson, LessonSection } from './types'

export const CORE_LESSONS: Record<string, Lesson> = {
  ...CORE_PHASE1_LESSONS,
  ...CORE_PHASE2_LESSONS,
  ...CORE_PHASE3_LESSONS,
  ...CORE_PHASE4_LESSONS,
  ...CORE_PHASE5_LESSONS,
}

export const MASTERY_LESSONS: Record<string, Lesson> = {
  ...MASTERY_BLUETEAM_LESSONS,
  ...MASTERY_OFFENSE_LESSONS,
  ...MASTERY_FORENSICS_LESSONS,
  ...MASTERY_CLOUD_LESSONS,
  ...MASTERY_GRC_LESSONS,
}

export function getCoreLesson(id: string): Lesson | undefined {
  return CORE_LESSONS[id]
}

export function getMasteryLesson(id: string): Lesson | undefined {
  return MASTERY_LESSONS[id]
}
