import TwoChoiceQuizGame from './TwoChoiceQuizGame'
import { PACKET_ROUNDS } from './gameData'

export default function PacketDetective() {
  return (
    <TwoChoiceQuizGame
      gameId="packet-detective"
      emoji="📡"
      title="Packet Detective"
      instructions="Ten traffic patterns pulled from logs. For each one, decide: normal activity, or an indicator of compromise?"
      choiceLabels={['Normal', 'Suspicious']}
      choiceColors={['#34d399', '#fb7185']}
      rounds={PACKET_ROUNDS}
      maxScore={10}
    />
  )
}
