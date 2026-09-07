import { INCIDENT_SCENARIO } from './incident'
import { RECON_SCENARIO } from './recon'
import { HARDENING_SCENARIO } from './hardening'
import type { Scenario } from '../types'

export const SCENARIOS: Scenario[] = [INCIDENT_SCENARIO, RECON_SCENARIO, HARDENING_SCENARIO]

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}

export { INCIDENT_SCENARIO, RECON_SCENARIO, HARDENING_SCENARIO }
