import ScenarioTerminal from './ScenarioTerminal'
import { HARDENING_SCENARIO } from '../terminal-sim/scenarios'

export default function SimHardening() {
  return <ScenarioTerminal scenario={HARDENING_SCENARIO} gameId="sim-hardening" />
}
