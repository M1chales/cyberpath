import TwoChoiceQuizGame from './TwoChoiceQuizGame'
import { PHISHING_ROUNDS } from './gameData'

export default function PhishingSpotter() {
  return (
    <TwoChoiceQuizGame
      gameId="phishing-spotter"
      emoji="🎣"
      title="Phishing Spotter"
      instructions="Ten real-world-style emails. For each one, decide: legit or phishing? Read carefully — the tells are always in the details."
      choiceLabels={['Legit', 'Phishing']}
      choiceColors={['#34d399', '#fb7185']}
      rounds={PHISHING_ROUNDS}
      maxScore={10}
    />
  )
}
