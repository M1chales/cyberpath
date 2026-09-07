import type { Lesson } from './types'

export const MASTERY_CLOUD_LESSONS: Record<string, Lesson> = {
  'm-multicloud': {
    intro:
      'Week 18 taught cloud security fundamentals inside a single account. This module scales that up: designing the account and network architecture itself so that good security boundaries are the default, across multiple accounts and even multiple cloud providers.',
    builtOn: ['Week 18 — Cloud Security Fundamentals'],
    sections: [
      {
        heading: 'Landing zones and segmentation strategy',
        paragraphs: [
          'A landing zone is a pre-architected multi-account (or multi-subscription, or multi-project) structure, designed so that, for example, production and development environments are fully isolated from each other by default — the cloud-scale version of the network segmentation from Week 6, and the least-privilege thinking from Weeks 7, 8, and 18, applied at the level of an entire organization\'s cloud footprint rather than one account.',
        ],
      },
      {
        heading: 'Cross-cloud identity patterns',
        paragraphs: [
          'Organizations running more than one cloud provider need identity federation — a single trusted identity source (often the same one used for on-premises AD from Week 3 and 8) that each cloud provider trusts, rather than separate, duplicated identity silos per provider that inevitably drift out of sync and create forgotten, over-privileged accounts.',
        ],
      },
      {
        heading: 'Infrastructure-as-code security scanning',
        paragraphs: [
          'When infrastructure is defined as code (Terraform, CloudFormation) rather than clicked together manually, security misconfigurations can be caught before deployment by scanning the code itself — the cloud equivalent of the SAST concept you will see formalized in the DevSecOps module, catching a public storage bucket or an overly permissive security group in a code review rather than after it is already live.',
        ],
        code: 'checkov -d ./terraform/   # scans Terraform code for known misconfiguration patterns before deploy',
      },
      {
        heading: 'Centralized logging across providers',
        paragraphs: [
          'Running multiple clouds means multiple native logging systems (CloudTrail, Azure Activity Log, and others); a mature architecture centralizes these into one place for correlation and detection, extending the SIEM-ingestion principle from Week 13 across the entire multi-cloud footprint rather than leaving each provider\'s logs siloed and separately monitored.',
        ],
      },
    ],
    takeaways: [
      'A landing zone builds segmentation and least privilege into the account structure itself, at organizational scale.',
      'Identity federation avoids duplicated, drifting identity silos across multiple cloud providers.',
      'Scanning infrastructure-as-code catches misconfigurations before deployment, not after.',
      'Centralized logging extends Week 13\'s SIEM principle across every cloud provider in use, not just one.',
    ],
  },

  'm-container-security': {
    intro:
      'Week 18 briefly introduced containers as an extension of the shared-responsibility model. This module treats container and Kubernetes security as its own full discipline — because most teams run this layer with far looser defaults than they realize, which is exactly why the skill is in high demand.',
    builtOn: ['Week 18 — Cloud Security Fundamentals', 'Week 7 — Hardening Linux & Windows Systems'],
    sections: [
      {
        heading: 'Image hardening and supply-chain scanning',
        paragraphs: [
          'A container image is built from layers, often starting from a public base image whose contents you did not personally vet — scanning that image for known vulnerabilities before deployment is the direct container-world extension of the vulnerability scanning workflow from Weeks 7 and 9, just applied to a software supply chain rather than a running host.',
        ],
      },
      {
        heading: 'Kubernetes RBAC, network policies, and pod security',
        paragraphs: [
          'Kubernetes Role-Based Access Control governs who can do what within a cluster — the direct conceptual sibling of the Windows ACLs (Week 3) and cloud IAM (Week 18) you have already studied. Network policies restrict which pods can talk to which other pods by default (segmentation again, at the container level), and pod security standards prevent a container from running with unnecessarily broad privileges on the underlying host.',
        ],
      },
      {
        heading: 'Container escape and privilege escalation',
        paragraphs: [
          'A container escape is when a process breaks out of its intended isolation and gains access to the underlying host or other containers — the containerized-world version of the privilege escalation concepts from Week 11, and one of the most serious possible outcomes in this environment because a single compromised container can potentially expose everything else on the same host.',
        ],
      },
      {
        heading: 'Policy-as-code enforcement',
        paragraphs: [
          'Tools like OPA/Gatekeeper or Kyverno let you define security rules ("no container may run as root," "no image without a passing vulnerability scan may deploy") that are automatically enforced at deploy time, rather than relying on a human to remember and manually check every deployment — the container-native equivalent of the IaC scanning from the multi-cloud module, but enforced continuously rather than only checked once.',
        ],
      },
    ],
    takeaways: [
      'Image scanning extends Week 7\'s vulnerability management to the software supply chain a container is built from.',
      'Kubernetes RBAC and network policies mirror the identity and segmentation principles from earlier in the course, applied at the container level.',
      'A container escape is a specific, serious privilege-escalation outcome unique to this environment.',
      'Policy-as-code enforces security rules automatically at deploy time instead of relying on manual review.',
    ],
  },

  'm-devsecops': {
    intro:
      'Week 10 taught you to find vulnerabilities in a web application after it existed. DevSecOps is about catching — and ideally preventing — those same vulnerability classes earlier, inside the actual software delivery pipeline, before they ever reach production.',
    builtOn: ['Week 10 — Web Application Security — OWASP Top 10', 'Week 18 — Cloud Security Fundamentals'],
    sections: [
      {
        heading: 'SAST, DAST, and SCA — three different scans for three different problems',
        paragraphs: [
          'Static Application Security Testing (SAST) scans source code itself for dangerous patterns, without running it. Dynamic Application Security Testing (DAST) scans a running application from the outside — conceptually similar to the Burp Suite testing from Week 10, but automated and run continuously. Software Composition Analysis (SCA) checks your third-party dependencies for known vulnerabilities, which matters because most modern applications contain far more third-party code than code an organization actually wrote itself.',
        ],
      },
      {
        heading: 'Pipeline security gates without scan fatigue',
        paragraphs: [
          'Adding these scans as automated gates in a CI/CD pipeline can block a vulnerable deployment before it ever reaches production — but a gate that generates constant false positives quickly gets ignored or bypassed, echoing the alert-fatigue problem from Week 13. Tuning these scans to be trustworthy is as important as running them at all.',
        ],
      },
      {
        heading: 'Secure code review and threat modeling',
        paragraphs: [
          'A secure code review looks for the same OWASP Top 10 classes from Week 10, but reads the actual source rather than testing a running application black-box — often catching issues DAST alone would miss. Threat modeling happens even earlier, during design, asking "what could go wrong with this feature before we write a single line of it" — the cheapest point in the entire lifecycle to fix a security flaw.',
        ],
      },
      {
        heading: 'Risk-based prioritization for engineering teams',
        paragraphs: [
          'A pipeline that flags every finding as equally urgent will simply be ignored by developers with delivery deadlines. The actual skill in this specialization is largely organizational: prioritizing findings by real risk, communicating them in terms engineering teams will act on, and building enough trust that your findings get fixed rather than dismissed.',
        ],
      },
    ],
    takeaways: [
      'SAST, DAST, and SCA each catch different problems — source code flaws, running-app flaws, and vulnerable dependencies respectively.',
      'A noisy pipeline gate gets bypassed, just like a noisy SIEM gets ignored — tuning matters as much as coverage.',
      'Threat modeling at design time is the cheapest point in the entire lifecycle to catch a security flaw.',
      'The hardest part of DevSecOps is organizational trust with engineering teams, not the tooling itself.',
    ],
  },
}
