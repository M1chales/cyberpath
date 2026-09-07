import type { ModuleQuiz } from './types'

export const MASTERY_CLOUD_QUIZZES: Record<string, ModuleQuiz> = {
  'm-multicloud': [
    {
      question: 'What is a "landing zone" in multi-cloud architecture?',
      options: [
        'A single shared account for all environments',
        'A pre-architected multi-account structure designed so security boundaries (like prod/dev isolation) are the default',
        'A physical data center location',
        'A type of firewall appliance',
      ],
      correctIndex: 1,
      explanation: 'A landing zone builds segmentation and least privilege into the account structure itself, at organizational scale.',
    },
    {
      question: 'Why does identity federation matter for organizations using more than one cloud provider?',
      options: [
        'It is required by law in most countries',
        'It avoids duplicated, drifting identity silos across providers that inevitably become inconsistent and over-privileged',
        'It removes the need for MFA',
        'It only applies to on-premises systems',
      ],
      correctIndex: 1,
      explanation: 'A single trusted identity source that each provider trusts prevents separate, drifting identity systems per cloud.',
    },
    {
      question: 'What does scanning infrastructure-as-code (e.g. with Checkov) before deployment accomplish?',
      options: [
        'It slows down deployments with no real benefit',
        'It catches security misconfigurations in the code itself, before they are ever deployed live',
        'It replaces the need for cloud IAM entirely',
        'It only works on already-deployed infrastructure',
      ],
      correctIndex: 1,
      explanation: 'IaC scanning is the cloud equivalent of SAST — catching a misconfiguration in review rather than after it is already live.',
    },
    {
      question: 'What does centralized logging across multiple cloud providers extend from earlier in the course?',
      options: [
        'The subnetting math from Week 1',
        'The SIEM-ingestion principle from Week 13, applied across every cloud provider in use',
        'The phishing simulation process from Week 12',
        'The OWASP Top 10 from Week 10',
      ],
      correctIndex: 1,
      explanation: 'Centralizing multiple providers\' native logs for correlation is the same SIEM-ingestion idea, scaled to a multi-cloud footprint.',
    },
  ],
  'm-container-security': [
    {
      question: 'What does scanning a container image for known vulnerabilities before deployment address?',
      options: [
        'Network segmentation',
        'Software supply-chain risk, since most images are built on public base images the team did not personally vet',
        'Physical hardware failures',
        'DNS misconfiguration',
      ],
      correctIndex: 1,
      explanation: 'Image scanning extends vulnerability management to the software supply chain a container image is actually built from.',
    },
    {
      question: 'What is a "container escape"?',
      options: [
        'A container automatically shutting down',
        'A process breaking out of its intended isolation to access the underlying host or other containers',
        'A network connection timing out',
        'A container being deleted accidentally',
      ],
      correctIndex: 1,
      explanation: 'A container escape is one of the most serious outcomes in this environment, since one compromised container could expose the whole host.',
    },
    {
      question: 'What is the purpose of policy-as-code tools like OPA/Gatekeeper or Kyverno?',
      options: [
        'To write application business logic',
        'To automatically enforce security rules (like "no container may run as root") at deploy time',
        'To replace Kubernetes RBAC entirely',
        'To generate container images',
      ],
      correctIndex: 1,
      explanation: 'Policy-as-code enforces defined rules continuously and automatically, rather than relying on manual review of every deployment.',
    },
    {
      question: 'Why does the module say this specialization is in high demand?',
      options: [
        'Because very few organizations use Kubernetes',
        'Because most teams run Kubernetes with defaults far looser than they realize',
        'Because container security requires no prior networking knowledge',
        'Because it does not require hands-on lab practice',
      ],
      correctIndex: 1,
      explanation: 'Kubernetes is often deployed with loose defaults, making genuine expertise in locking it down both rare and valuable.',
    },
  ],
  'm-devsecops': [
    {
      question: 'What does SCA (Software Composition Analysis) specifically check for?',
      options: [
        'Bugs in your own original source code only',
        'Known vulnerabilities in third-party dependencies your application relies on',
        'Network firewall misconfigurations',
        'Physical server temperature',
      ],
      correctIndex: 1,
      explanation: 'SCA scans third-party dependencies specifically, which often make up more of an application\'s code than what the team wrote itself.',
    },
    {
      question: 'What happens when a CI/CD pipeline security gate generates too many false positives?',
      options: [
        'It automatically becomes more accurate over time',
        'Developers tend to ignore or bypass it, echoing the alert-fatigue problem from Week 13',
        'The pipeline stops running entirely',
        'It has no negative effect on adoption',
      ],
      correctIndex: 1,
      explanation: 'A noisy gate gets bypassed just like a noisy SIEM gets ignored — tuning for trustworthiness matters as much as coverage.',
    },
    {
      question: 'When is threat modeling performed, and why does timing matter?',
      options: [
        'After deployment, since that is when real usage patterns are known',
        'During design, before a line of code is written — the cheapest point in the lifecycle to catch a security flaw',
        'Only during a live security incident',
        'Threat modeling has no fixed timing',
      ],
      correctIndex: 1,
      explanation: 'Doing threat modeling at the design stage catches flaws when they are cheapest to fix, before implementation even begins.',
    },
    {
      question: 'According to this module, what is the hardest part of DevSecOps in practice?',
      options: [
        'Choosing which SAST tool to buy',
        'The organizational challenge of getting developers to trust and act on findings, not the tooling itself',
        'Writing the actual scanning scripts',
        'There is no hard part once tools are purchased',
      ],
      correctIndex: 1,
      explanation: 'Technical scanning is comparatively easy; earning genuine developer trust and prioritizing findings well is the real, ongoing challenge.',
    },
  ],
}
