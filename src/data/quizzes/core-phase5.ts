import type { ModuleQuiz } from './types'

export const CORE_PHASE5_QUIZZES: Record<string, ModuleQuiz> = {
  w17: [
    {
      question: 'Why do real systems typically use both symmetric and asymmetric encryption together, as in a TLS handshake?',
      options: [
        'Because regulations require using two algorithms',
        'Asymmetric encryption solves key distribution, then a symmetric key (fast) handles the actual bulk data encryption',
        'Symmetric encryption is illegal in most countries',
        'Asymmetric encryption is always faster than symmetric',
      ],
      correctIndex: 1,
      explanation: 'Asymmetric cryptography securely exchanges a symmetric key, which is then used for fast, bulk encryption of the actual data.',
    },
    {
      question: 'What problem does salting a password hash specifically solve?',
      options: [
        'It makes the hash function run faster',
        'It prevents precomputed "rainbow table" attacks and ensures identical passwords produce different stored hashes per user',
        'It encrypts the password so it can be reversed later',
        'It eliminates the need for a minimum password length',
      ],
      correctIndex: 1,
      explanation: 'A unique salt per user defeats precomputed attacks and means two users with the same password do not share the same stored hash.',
    },
    {
      question: 'What does a digital signature prove?',
      options: [
        'Only that a message was encrypted',
        'That a message came from the holder of a specific private key, and has not been altered since signing',
        'That a website has no vulnerabilities',
        'That a certificate will never expire',
      ],
      correctIndex: 1,
      explanation: 'A signature proves both authenticity (who signed it) and integrity (it was not changed afterward).',
    },
    {
      question: 'What does a certificate revocation mechanism address?',
      options: [
        'Certificates that have already expired naturally',
        'A certificate being compromised before its normal expiration date',
        'Slow website loading times',
        'DNS resolution failures',
      ],
      correctIndex: 1,
      explanation: 'Revocation exists specifically for the case where a certificate needs to be distrusted before it would otherwise expire.',
    },
  ],
  w18: [
    {
      question: 'Under the shared responsibility model, who is generally responsible for configuring IAM roles and storage permissions correctly?',
      options: [
        'Always the cloud provider',
        'The customer, in nearly all cloud service models',
        'No one — it is automatic',
        'A third-party auditor',
      ],
      correctIndex: 1,
      explanation: 'The provider secures the underlying infrastructure, but configuration choices like IAM and storage permissions remain the customer\'s responsibility.',
    },
    {
      question: 'What is one of the most common real-world causes of cloud data breaches, according to this lesson?',
      options: [
        'Sophisticated nation-state zero-day exploits',
        'A cloud storage bucket left publicly accessible by mistake',
        'Physical theft of a data center',
        'Weak encryption algorithms used by the provider',
      ],
      correctIndex: 1,
      explanation: 'A misconfigured, publicly exposed storage bucket is a pure configuration error and one of the most common breach causes in practice.',
    },
    {
      question: 'What is the cloud-native equivalent of the network firewalls and segmentation from Week 6?',
      options: ['IAM roles', 'Cloud security groups / network security groups', 'CloudTrail logs', 'A CDN'],
      correctIndex: 1,
      explanation: 'Cloud security groups apply the same default-deny, allow-only-what-is-needed logic as physical firewalls, just expressed as configuration.',
    },
    {
      question: 'Why are cloud audit logs like CloudTrail especially important for investigations?',
      options: [
        'They are required reading for compliance certificates',
        'Cloud resources can be created and destroyed in seconds, so logs are often the only record an unauthorized action occurred',
        'They automatically block malicious activity',
        'They replace the need for IAM policies',
      ],
      correctIndex: 1,
      explanation: 'Because cloud infrastructure is ephemeral, the audit log may be the only durable evidence that an action ever took place.',
    },
  ],
  w19: [
    {
      question: 'What is the main practical difference between NIST CSF/ISO 27001 and a specific regulation like HIPAA?',
      options: [
        'They are the exact same type of document',
        'CSF/ISO 27001 provide structural frameworks; HIPAA is a specific legal requirement tied to a particular category of data',
        'HIPAA only applies outside the United States',
        'CSF is a law, and HIPAA is voluntary',
      ],
      correctIndex: 1,
      explanation: 'Frameworks like CSF provide general structure; regulations like HIPAA impose specific, legally binding requirements on particular data types.',
    },
    {
      question: 'In a risk assessment, what two factors are typically combined to prioritize risks?',
      options: ['Cost and color', 'Likelihood and impact', 'Popularity and age', 'Location and size'],
      correctIndex: 1,
      explanation: 'Risk is generally prioritized by how likely it is to occur combined with how severe the impact would be.',
    },
    {
      question: 'What is the correct relationship between a policy, a standard, and a procedure?',
      options: [
        'They are interchangeable terms for the same document',
        'A policy states intent, a standard defines the measurable requirement, and a procedure gives the step-by-step instructions',
        'A procedure is broader than a policy',
        'A standard is a legal requirement and a policy is optional',
      ],
      correctIndex: 1,
      explanation: 'Policy (intent) → standard (specific requirement) → procedure (exact steps) are three distinct, increasingly specific levels.',
    },
    {
      question: 'What does "responsible disclosure" balance?',
      options: [
        'Marketing benefit versus development cost',
        'The public\'s right to know about a vulnerability versus giving attackers a roadmap before a fix exists',
        'Employee salaries versus company profit',
        'Server uptime versus feature releases',
      ],
      correctIndex: 1,
      explanation: 'Responsible disclosure gives the affected organization reasonable time to fix an issue before any public disclosure of the details.',
    },
  ],
  w20: [
    {
      question: 'What is the actual purpose of the Week 20 capstone exercise?',
      options: [
        'To learn one brand-new, unrelated technical skill',
        'To prove that attack, detection, and response skills from across the whole course connect into one working skill set',
        'To pass a proctored certification exam',
        'To memorize every tool name used in the course',
      ],
      correctIndex: 1,
      explanation: 'The capstone deliberately combines offensive, detection, and response skills from across the entire course into a single coherent case study.',
    },
    {
      question: 'Why does the lesson recommend publishing your best write-ups publicly?',
      options: [
        'It is required to receive a certificate',
        'Concrete, applied evidence of skill carries more weight than a list of topics you say you studied',
        'It guarantees a job offer',
        'Public write-ups are the only way to complete the course',
      ],
      correctIndex: 1,
      explanation: 'A portfolio gives anyone evaluating you real, verifiable proof of applied skill rather than just a list of claimed knowledge.',
    },
    {
      question: 'How should certifications be chosen, according to this lesson?',
      options: [
        'Collect as many as possible regardless of relevance',
        'Based on the specific role you are targeting next, not for their own sake',
        'Always start with the hardest available certification',
        'Certifications should never be pursued',
      ],
      correctIndex: 1,
      explanation: 'Different certifications map to different roles (Security+, CySA+, PenTest+); pick based on your actual target, not collection for its own sake.',
    },
    {
      question: 'What does the lesson say is the actual foundation of the "first call" reputation?',
      options: [
        'Holding the most certifications',
        'Consistent, public, honest track record — including being upfront about the limits of your knowledge',
        'Never admitting uncertainty about anything',
        'Working alone without any community involvement',
      ],
      correctIndex: 1,
      explanation: 'Durable trust is built through consistent, honest, visible track record over time, not through appearing infallible.',
    },
  ],
}
