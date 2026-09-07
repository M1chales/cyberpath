import type { Lesson } from './types'

export const CORE_PHASE5_LESSONS: Record<string, Lesson> = {
  w17: {
    intro:
      'You have referenced TLS, hashing, and password storage in passing since Week 5. This week you actually build the cryptographic infrastructure yourself — enough real depth to use it correctly and, just as importantly, to recognize immediately when it is broken.',
    builtOn: ['Week 5 — TCP/IP Deep Dive & Packet Analysis', 'Week 8 — Identity, Access & Active Directory Security'],
    sections: [
      {
        heading: 'Symmetric vs. asymmetric encryption',
        paragraphs: [
          'Symmetric encryption (AES is the standard) uses the same key to encrypt and decrypt — fast, but both parties need the key already, which creates a distribution problem. Asymmetric encryption (RSA, or the more modern and efficient ECC) uses a mathematically linked key pair: anything encrypted with the public key can only be decrypted with the private key. In practice, nearly every real system uses both together: asymmetric cryptography solves the key-distribution problem by securely exchanging a symmetric key, which then does the actual bulk encryption — exactly what happens in the TLS handshake you glimpsed in Week 5.',
        ],
      },
      {
        heading: 'Hashing, salting, and password storage',
        paragraphs: [
          'A hash function turns any input into a fixed-size, one-way fingerprint — you cannot reverse a hash back into the original password, only compare a new hash against a stored one. A salt is random data added to a password before hashing, unique per user, which defeats precomputed "rainbow table" attacks and ensures that two users with the same password produce completely different stored hashes. This is the mechanism underneath every "your password is stored securely" claim from Weeks 3 and 8 — and this week\'s hands-on task has you demonstrate exactly why unsalted hashes fail.',
        ],
        code: 'hash("password123")                    -> same output every time, for everyone\nhash("password123" + userSalt)         -> unique output per user, even with an identical password',
      },
      {
        heading: 'Digital signatures and certificates',
        paragraphs: [
          'A digital signature proves two things at once: that a message came from the holder of a specific private key (authenticity), and that it has not been altered since signing (integrity) — using asymmetric cryptography in the opposite direction from encryption. A certificate binds a public key to an identity (a domain name, an organization) and is itself digitally signed by a trusted third party, which is what lets your browser trust that a public key really belongs to the website it claims to.',
        ],
      },
      {
        heading: 'PKI: certificate authorities, chains of trust, and revocation',
        paragraphs: [
          'Public Key Infrastructure is the whole system that makes certificates trustworthy: a Certificate Authority (CA) verifies identity and signs certificates, browsers and operating systems ship with a list of CAs they trust by default, and a chain of trust lets an intermediate CA\'s certificate be validated back up to a trusted root. Revocation exists because a certificate can be compromised before it expires — a mechanism to say "this certificate should no longer be trusted, even though it has not expired yet."',
        ],
        callout: {
          label: "This week's hands-on task",
          text: 'You will build your own small CA and issue yourself a certificate — the exact same trust chain concept, just one you control end to end instead of relying on a public CA.',
        },
      },
      {
        heading: 'The TLS handshake in detail, and common misconfigurations',
        paragraphs: [
          'Building on the "glimpse" from Week 5: a TLS handshake negotiates a protocol version and cipher suite, the server presents its certificate (verified against the chain of trust above), the two sides establish a shared symmetric key using asymmetric cryptography, and only then does encrypted application data flow. Common misconfigurations — expired certificates, support for outdated/weak cipher suites, missing intermediate certificates — are exactly what a tool like testssl.sh is built to find automatically, and exactly what you will scan for against your own lab server this week.',
        ],
      },
    ],
    takeaways: [
      'Symmetric encryption is fast but needs key distribution; asymmetric solves that distribution problem, which is why real systems use both together.',
      'Salting defeats precomputed attacks and ensures identical passwords never produce identical stored hashes.',
      'A digital signature proves authenticity and integrity at once, using asymmetric cryptography in reverse.',
      'A certificate is only as trustworthy as the chain of CAs that vouch for it, back to a trusted root.',
      'A TLS misconfiguration (weak ciphers, expired certs) can quietly undermine an otherwise correct cryptographic design — always verify, do not assume.',
    ],
  },

  w18: {
    intro:
      'Everything so far assumed infrastructure you can physically see and directly control. Most organizations now run at least part of their infrastructure in the cloud, where the rules of segmentation (Week 6) and hardening (Week 7) still apply — but the shared-responsibility boundary changes exactly who is responsible for enforcing them.',
    builtOn: ['Week 6 — Network Defense: Firewalls, VPNs & Segmentation', 'Week 7 — Hardening Linux & Windows Systems'],
    sections: [
      {
        heading: 'The shared responsibility model',
        paragraphs: [
          'A cloud provider secures the underlying infrastructure — physical data centers, the virtualization layer, the network backbone. You remain responsible for everything you configure on top of it: identity, data, network rules, and the operating system itself if you are running virtual machines (IaaS) rather than fully managed services (PaaS/SaaS, where the provider takes on more). The single most common real-world cloud breach is not a provider failure at all — it is a customer misconfiguration of something that was always their responsibility.',
        ],
      },
      {
        heading: 'IAM: the cloud version of least privilege',
        paragraphs: [
          'Identity and Access Management in the cloud is the direct evolution of the tiered-admin and least-privilege principles from Weeks 7 and 8: roles should grant exactly the permissions a task needs, access keys should be rotated and never hardcoded into source code, and human users should authenticate through the same MFA-backed identity system rather than sharing static credentials.',
        ],
      },
      {
        heading: 'Storage security and network security groups',
        paragraphs: [
          'A cloud storage bucket left publicly accessible by mistake is one of the single most common real-world data breach causes — a pure configuration error, not a sophisticated attack. Cloud network security groups are functionally the same concept as the firewalls and segmentation from Week 6, just defined as configuration rather than physical hardware — the underlying default-deny, allow-only-what-is-needed logic does not change.',
        ],
      },
      {
        heading: 'Cloud logging and monitoring',
        paragraphs: [
          'Services like AWS CloudTrail or Azure Monitor record every API call made against a cloud account — who did what, when, from where — the cloud equivalent of the Event Viewer logs from Week 3 and the SIEM ingestion from Week 13. Because cloud resources can be created and destroyed in seconds, and because an attacker who obtains valid credentials can act instantly from anywhere, this logging is often the only record that an unauthorized action ever happened at all.',
        ],
      },
      {
        heading: 'Container and serverless security, briefly',
        paragraphs: [
          'Containers package an application with its dependencies for consistent deployment, and serverless functions run code without you managing a server at all — both shift the shared-responsibility line even further toward the provider, but introduce their own configuration risks (an overly permissive container, a serverless function with excessive permissions). This is only an introduction here; the Mastery Track\'s Container & Kubernetes Security module goes considerably deeper.',
        ],
      },
    ],
    takeaways: [
      'The shared responsibility model splits security duties between provider and customer — and most real breaches come from the customer\'s half.',
      'Cloud IAM is least privilege and MFA, applied to roles, keys, and identities instead of just local user accounts.',
      'A publicly exposed storage bucket is a plain configuration mistake, not a sophisticated attack — and one of the most common breach causes that exists.',
      'Cloud security groups are the same segmentation logic as Week 6\'s firewalls, expressed as configuration rather than hardware.',
      'Cloud audit logs (CloudTrail, Azure Monitor) are often the only proof an unauthorized action occurred — treat them as essential, not optional.',
    ],
  },

  w19: {
    intro:
      'Every technical control in this course exists inside an organization that has to justify spending on it, comply with laws, and make defensible decisions about which risks to accept versus fix. This week is the paperwork side that decides what actually gets built, funded, and prioritized — and the ethical and legal obligations that come with everything you have learned so far.',
    builtOn: ['Week 9 — Reconnaissance & Vulnerability Scanning', 'Week 16 — Incident Response: Plan, Contain, Eradicate, Recover'],
    sections: [
      {
        heading: 'Frameworks: NIST CSF and ISO 27001',
        paragraphs: [
          'The NIST Cybersecurity Framework organizes security activity into five (now six) functions — Govern, Identify, Protect, Detect, Respond, Recover — as a common structure for describing a security program\'s maturity, without prescribing specific tools. ISO 27001 is an international standard for an Information Security Management System that organizations can be formally certified against. Neither framework tells you exactly what to buy — both give you a structure for proving your program is complete and defensible.',
        ],
      },
      {
        heading: 'Regulations: GDPR, HIPAA, PCI-DSS',
        paragraphs: [
          'GDPR governs personal data of people in the EU regardless of where the processing organization is located, and imposes real financial penalties for mishandling it. HIPAA governs health information in the US. PCI-DSS is an industry (not government) standard required by payment card companies for anyone handling card data. Each has different scope and different specific requirements, but the underlying pattern is the same: certain categories of data carry legal or contractual obligations that shape technical decisions well beyond pure security preference.',
        ],
      },
      {
        heading: 'Risk assessment: likelihood, impact, and risk registers',
        paragraphs: [
          'A risk assessment estimates, for each identified risk, how likely it is to occur and how bad the impact would be if it did — multiplying (or otherwise combining) the two to prioritize a limited budget against a much longer list of possible problems than any organization can fully address. A risk register documents this systematically, and risk appetite defines how much risk leadership has actually decided is acceptable to simply live with rather than spend money mitigating.',
        ],
        callout: {
          label: 'Connects back',
          text: 'This week\'s hands-on task has you map your Week 16 incident response plan against the NIST CSF functions — a direct test of whether your technical work and this week\'s governance framework actually line up.',
        },
      },
      {
        heading: 'Policies, standards, and procedures',
        paragraphs: [
          'A policy states intent at a high level ("all laptops must be encrypted"). A standard defines the specific, measurable requirement that satisfies it ("AES-256 full-disk encryption"). A procedure is the step-by-step instructions for actually doing it. Confusing these levels is a common real-world mistake — a policy without a standard is unenforceable, and a procedure without a policy behind it has no authority when someone pushes back.',
        ],
      },
      {
        heading: 'Ethics and responsible disclosure',
        paragraphs: [
          'Responsible disclosure is the practice of privately reporting a discovered vulnerability to the affected organization and giving them reasonable time to fix it before any public disclosure — balancing the public\'s right to know against giving attackers a roadmap before a fix exists. Every offensive skill from Weeks 9–12 carries this ethical obligation alongside it, which is exactly why this week has you draft a disclosure policy from the receiving organization\'s point of view, not just the reporter\'s.',
        ],
      },
    ],
    takeaways: [
      'NIST CSF and ISO 27001 give structure for proving a security program is complete — neither prescribes specific tools.',
      'GDPR, HIPAA, and PCI-DSS each attach legal or contractual obligations to specific categories of data.',
      'Risk assessment prioritizes a limited budget against likelihood and impact, documented in a risk register against a stated risk appetite.',
      'Policy, standard, and procedure are three distinct levels — confusing them is a common, avoidable mistake.',
      'Responsible disclosure balances the public\'s right to know against giving attackers a head start, and applies to every offensive skill you have learned.',
    ],
  },

  w20: {
    intro:
      'Every phase of this course has been building toward this week: proving, end to end, that you can attack, detect, respond to, and learn from a real incident in your own lab — and then turning that proof into an actual next step, whether that is a job application or simply becoming the person your community trusts first.',
    builtOn: ['Weeks 9–12 — Offensive Security Fundamentals', 'Weeks 13–16 — Defensive Security & Incident Response'],
    sections: [
      {
        heading: 'The capstone: attack, detect, respond, in one case study',
        paragraphs: [
          'Using your Week 9–12 offensive skills, attack your own lab. Using your Week 13–14 SIEM and detection engineering, detect it. Using your Week 15–16 forensics and incident response skills, investigate and respond to it. Document the whole thing as a single, coherent case study — this is not busywork; it is direct, concrete proof (to an employer, or simply to yourself) that every phase of this course actually connects into one working skill set rather than twenty disconnected topics.',
        ],
      },
      {
        heading: 'Building a public portfolio',
        paragraphs: [
          'Every deliverable you produced across all twenty weeks — the PCAP analysis from Week 5, the hardening report from Week 7, the incident response plan from Week 16 — is portfolio material. Publishing your best three to five write-ups publicly (a GitHub repository or a simple personal site) gives anyone evaluating you concrete evidence of real, applied skill, which carries far more weight than a list of topics you have "studied."',
        ],
      },
      {
        heading: 'Resume, LinkedIn, and interview positioning',
        paragraphs: [
          'For entry-level roles — SOC analyst, junior pentester, IT-security-generalist — hands-on lab work and a portfolio genuinely compensate for a lack of paid experience, but only if you can talk about it specifically: not "I learned about incident response" but "I wrote and ran a tabletop exercise for a ransomware scenario, timing myself through all six NIST phases." Specificity is what separates a credible junior candidate from someone who only read about the field.',
        ],
      },
      {
        heading: 'Choosing your certification roadmap',
        paragraphs: [
          'Certifications validate what you already know to someone who has not seen your portfolio yet, and different certs map to different roles: Security+ for a broad generalist foundation, CySA+ for detection and response, PenTest+ for offensive work, and beyond that the deeper, harder mastery-track certifications like OSCP. Choose based on the specific role you are targeting next, not on collecting credentials for their own sake.',
        ],
      },
      {
        heading: 'Building the "first call" reputation, responsibly',
        paragraphs: [
          'Being the person people trust first — for a friend\'s malware infection, a family member\'s phishing scare, a small business\'s first security question — is built the same way professional trust is built in the Mastery Track: consistently, publicly, and honestly, including being upfront about the limits of what you know at any given point. That honesty is not a weakness; it is exactly what makes the trust durable instead of temporary.',
        ],
      },
    ],
    takeaways: [
      'The capstone proves the whole course connects into one working skill set, not twenty separate topics.',
      'Every deliverable from the last 20 weeks is portfolio material — publish the best of it.',
      'Specificity about what you actually did beats a list of topics you studied, every time, in an interview.',
      'Pick certifications based on your target role, not for their own sake.',
      'The reputation this course is ultimately about is built the same way anywhere: consistently, publicly, and honestly — including about your own limits.',
    ],
  },
}
