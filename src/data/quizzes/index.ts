import { CORE_PHASE1_QUIZZES } from './core-phase1'
import { CORE_PHASE2_QUIZZES } from './core-phase2'
import { CORE_PHASE3_QUIZZES } from './core-phase3'
import { CORE_PHASE4_QUIZZES } from './core-phase4'
import { CORE_PHASE5_QUIZZES } from './core-phase5'
import { MASTERY_BLUETEAM_QUIZZES } from './mastery-blueteam'
import { MASTERY_OFFENSE_QUIZZES } from './mastery-offense'
import { MASTERY_FORENSICS_QUIZZES } from './mastery-forensics'
import { MASTERY_CLOUD_QUIZZES } from './mastery-cloud'
import { MASTERY_GRC_QUIZZES } from './mastery-grc'
import type { ModuleQuiz } from './types'

export type { ModuleQuiz, QuizQuestion } from './types'

export const CORE_QUIZZES: Record<string, ModuleQuiz> = {
  ...CORE_PHASE1_QUIZZES,
  ...CORE_PHASE2_QUIZZES,
  ...CORE_PHASE3_QUIZZES,
  ...CORE_PHASE4_QUIZZES,
  ...CORE_PHASE5_QUIZZES,
}

export const MASTERY_QUIZZES: Record<string, ModuleQuiz> = {
  ...MASTERY_BLUETEAM_QUIZZES,
  ...MASTERY_OFFENSE_QUIZZES,
  ...MASTERY_FORENSICS_QUIZZES,
  ...MASTERY_CLOUD_QUIZZES,
  ...MASTERY_GRC_QUIZZES,
}

export function getCoreQuiz(id: string): ModuleQuiz | undefined {
  return CORE_QUIZZES[id]
}

export function getMasteryQuiz(id: string): ModuleQuiz | undefined {
  return MASTERY_QUIZZES[id]
}

export const QUIZ_LENGTH = 4
