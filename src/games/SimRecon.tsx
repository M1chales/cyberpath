import ScenarioTerminal from './ScenarioTerminal'
import { RECON_SCENARIO } from '../terminal-sim/scenarios'

export default function SimRecon() {
  return <ScenarioTerminal scenario={RECON_SCENARIO} gameId="sim-recon" />
}
