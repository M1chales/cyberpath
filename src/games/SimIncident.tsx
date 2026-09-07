import ScenarioTerminal from './ScenarioTerminal'
import { INCIDENT_SCENARIO } from '../terminal-sim/scenarios'

export default function SimIncident() {
  return <ScenarioTerminal scenario={INCIDENT_SCENARIO} gameId="sim-incident" />
}
