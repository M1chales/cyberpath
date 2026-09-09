// Each option maps 1:1 to one of the six Mastery Track ids (see masteryTrack.ts) — a lightweight
// self-reflection tool, not a rigorous psychometric instrument. Whichever track accumulates the
// most picks across these four questions gets recommended.
export interface TrackFinderOption {
  trackId: string
  label: string
}

export interface TrackFinderQuestion {
  question: string
  options: TrackFinderOption[]
}

export const TRACK_FINDER_QUESTIONS: TrackFinderQuestion[] = [
  {
    question: 'Which sounds most satisfying to spend a Saturday on?',
    options: [
      { trackId: 'blue-team-mastery', label: 'Digging through logs until a hidden pattern clicks into place' },
      { trackId: 'offense-mastery', label: 'Chaining three small bugs into one real foothold' },
      { trackId: 'forensics-mastery', label: 'Reverse engineering a mystery binary line by line' },
      { trackId: 'cloud-appsec-mastery', label: "Redesigning a system so a whole bug class can't exist" },
      { trackId: 'grc-leadership-mastery', label: 'Turning a messy risk register into a real, funded plan' },
      { trackId: 'specialized-mastery', label: "Poking at something nobody's really taught you yet — wireless, AI, ICS" },
    ],
  },
  {
    question: 'When an incident happens, which reaction is most you?',
    options: [
      { trackId: 'blue-team-mastery', label: 'I want to be the one who catches it first, before anyone else notices' },
      { trackId: 'offense-mastery', label: 'I want to know exactly how they got in — could I have done that?' },
      { trackId: 'forensics-mastery', label: 'I want to reconstruct the full timeline, evidence-tight' },
      { trackId: 'cloud-appsec-mastery', label: 'I want to know how the pipeline let this ship in the first place' },
      { trackId: 'grc-leadership-mastery', label: 'I want to know what this costs the business and who needs to hear about it' },
      { trackId: 'specialized-mastery', label: "I want to know if it's a technique nobody's codified best practices for yet" },
    ],
  },
  {
    question: "Pick the tool you'd rather spend 6 months getting great at:",
    options: [
      { trackId: 'blue-team-mastery', label: 'A SIEM and a detection-as-code pipeline' },
      { trackId: 'offense-mastery', label: 'Burp Suite and a custom exploit chain' },
      { trackId: 'forensics-mastery', label: 'A disassembler and a memory-forensics toolkit' },
      { trackId: 'cloud-appsec-mastery', label: 'Terraform, Kubernetes, and a CI/CD security gate' },
      { trackId: 'grc-leadership-mastery', label: 'A risk register and a board-ready slide deck' },
      { trackId: 'specialized-mastery', label: 'Frida, a Modbus simulator, or a prompt-injection playground' },
    ],
  },
  {
    question: "What does 'winning' look like to you in this field?",
    options: [
      { trackId: 'blue-team-mastery', label: 'The attacker never even shows up undetected in the alert queue' },
      { trackId: 'offense-mastery', label: 'A report so good the client fixes it before anyone else finds it' },
      { trackId: 'forensics-mastery', label: 'A timeline so solid it holds up in court' },
      { trackId: 'cloud-appsec-mastery', label: 'An entire vulnerability class engineered out of existence' },
      { trackId: 'grc-leadership-mastery', label: 'Security funded and prioritized before the breach, not after' },
      { trackId: 'specialized-mastery', label: "Being the person who actually knows this niche when everyone else is guessing" },
    ],
  },
]
