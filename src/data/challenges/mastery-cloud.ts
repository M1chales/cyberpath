import type { Challenge } from './types'

export const MASTERY_CLOUD_CHALLENGES: Record<string, Challenge> = {
  'm-multicloud': {
    scenario:
      'A growing company has one flat AWS account: production, development, and a shared analytics environment all live side by side, all administered by the same small set of IAM users with broad permissions "to keep things simple."',
    task: 'Describe the landing-zone redesign you would propose, and explain — in terms a non-technical founder would find persuasive — why "keeping things simple" this way is actually a risk, not a simplification.',
    modelAnswer: [
      'Redesign: split into separate accounts (at minimum: production, development, and shared services/security tooling) under an organizational structure, each with its own scoped IAM roles rather than one shared set of broad-permission users.',
      'This directly follows the landing-zone concept: production should be blast-radius-isolated from development so that a mistake or compromise in a dev environment (generally less carefully guarded) cannot reach production data.',
      'Persuasive framing for a founder: "Right now, a single mistake by a developer testing something in the dev environment could accidentally affect real customer data in production — separating them isn\'t more complexity, it\'s removing a way for a small mistake to become a big one."',
      'Also worth naming directly: broad, shared IAM users make it impossible to know who actually did what during an incident — separate, scoped roles per person/team is what makes an eventual audit or incident investigation even possible.',
      'Acknowledge the real tradeoff honestly: this does add some initial setup complexity and cross-account access configuration — the recommendation should include that this is a worthwhile one-time cost, not pretend there is no cost at all.',
    ],
    stretchGoal: 'Sketch this multi-account structure on paper first, then actually build a minimal two-account version (even just prod vs. dev) on a free-tier AWS Organization.',
  },
  'm-container-security': {
    scenario:
      'A team\'s Kubernetes deployment YAML for a new service includes `privileged: true` in the container\'s security context, added months ago "to fix a permissions error" that no one remembers the details of.',
    task: 'Explain the actual risk this setting introduces, and describe the process you would follow to safely remove it without breaking the service.',
    modelAnswer: [
      'Risk: `privileged: true` gives the container nearly all the same capabilities as the underlying host itself, massively increasing the impact of any container escape — a vulnerability that would otherwise be contained to the container can now potentially compromise the whole node.',
      'This is a textbook case of the container escape and privilege-escalation risk model this module covers — a broad permission granted to solve one narrow, now-forgotten problem, left in place indefinitely.',
      'Safe removal process: first identify what specific capability the service actually needs (often it is one specific Linux capability, not the entire privileged mode) by testing in a non-production environment with privileged mode removed and observing what actually breaks.',
      'Replace the blanket `privileged: true` with the specific, minimal capability required (e.g. a single entry under `capabilities: add:`) rather than either leaving it fully privileged or guessing at a replacement.',
      'Add a policy-as-code rule (OPA/Gatekeeper or Kyverno, from this module) that blocks any future deployment from using `privileged: true` without an explicit, documented exception — preventing this exact situation from recurring silently.',
    ],
    stretchGoal: 'Reproduce this scenario in a local kind/minikube cluster: deploy something with privileged: true, then work through removing it to the minimal necessary capability.',
  },
  'm-devsecops': {
    scenario:
      'You just added a SAST scanner to the CI/CD pipeline. On its first run against the existing codebase, it returns 1,200 findings. The engineering team is now threatening to just disable the pipeline gate entirely.',
    task: 'Describe how you would handle this rollout differently to avoid losing the tool altogether, without ignoring genuine risk.',
    modelAnswer: [
      'The mistake was rolling out the gate in blocking mode against an untriaged, pre-existing codebase all at once — this is exactly the "scan fatigue" failure mode this module warns about, and it is now costing you the tool entirely.',
      'Immediate fix: switch to non-blocking (report-only) mode for existing code, while making the gate blocking only for new code going forward — this stops the bleeding of new risk without demanding an unrealistic all-at-once cleanup.',
      'Triage the 1,200 findings by real severity and exploitability, not raw count — many SAST findings on a first run against legacy code are low-severity or false positives, and presenting the true, smaller number of critical findings rebuilds credibility with the team.',
      'Negotiate a realistic, prioritized remediation timeline for the genuinely serious existing findings, rather than an unrealistic "fix everything now" demand that guarantees pushback.',
      'This whole situation is a direct illustration of this module\'s point: the hard part of DevSecOps is organizational trust, not the tooling — a technically correct tool rolled out without change-management thinking gets disabled regardless of its accuracy.',
    ],
    stretchGoal: 'Add a real SAST tool to one of your own projects and go through this exact triage exercise for real, sorting findings by genuine severity rather than reacting to the raw count.',
  },
}
