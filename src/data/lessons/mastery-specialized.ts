import type { Lesson } from './types'

export const MASTERY_SPECIALIZED_LESSONS: Record<string, Lesson> = {
  'm-wireless': {
    intro:
      'Every module so far has assumed an attacker who already has some network foothold — a phished credential, a scanned-open port. Wireless flips that assumption: an attacker within radio range of your building has a partial foothold before touching a single one of your systems, simply by being close enough to hear the traffic.',
    sections: [
      {
        heading: 'Why management frames matter',
        paragraphs: [
          '802.11 splits traffic into data, control, and management frames. Data frames carry your actual traffic and, on WPA2/WPA3, are encrypted. Management frames — the ones that handle association, authentication, and deauthentication — historically were not authenticated at all. That single design gap is what makes a deauthentication attack possible: an attacker can forge a deauth frame appearing to come from the access point, and a client will honor it and disconnect, with no way to tell it was forged.',
        ],
      },
      {
        heading: 'The WPA2 handshake, and why WPA3 closes the gap',
        paragraphs: [
          'WPA2\'s four-way handshake proves both sides know the pre-shared key without ever sending it in the clear — but it does so in a way that lets an attacker capture the handshake (by forcing a disconnect-reconnect with a deauth frame, tying directly back to the frame-authentication gap above) and crack it offline against a wordlist, entirely without the attacker ever needing to be authenticated. WPA3 replaces this with SAE (Simultaneous Authentication of Equals), a protocol specifically designed so a captured handshake yields nothing useful for offline cracking — the same attacker, the same captured traffic, but the underlying protocol math no longer permits the attack.',
        ],
      },
      {
        heading: 'Rogue APs and evil twins',
        paragraphs: [
          'A rogue AP attack broadcasts the same SSID as a legitimate network, often with a stronger signal. Client devices generally auto-reconnect to a known SSID without verifying it is the same physical access point — they check the name, not an identity. An "evil twin" combined with a captive portal can then harvest credentials directly, since the victim believes they are on their normal, trusted network the whole time.',
        ],
        callout: {
          label: 'The pattern to notice',
          text: 'Both the deauth attack and the rogue-AP attack exploit the same root cause: 802.11 clients trust unauthenticated broadcast information (a deauth frame, an SSID name) by default. Enterprise hardening (802.1X/EAP-TLS, WIPS) exists specifically to add the authentication layer that the base protocol never had.',
        },
      },
    ],
    takeaways: [
      'Unauthenticated management frames are the root cause behind deauthentication attacks and much of practical wireless attack tooling.',
      'WPA2\'s handshake is capturable and crackable offline; WPA3\'s SAE specifically closes that exact gap.',
      'Rogue AP / evil twin attacks work because clients trust an SSID name, not a verified access point identity.',
      'Wireless attacks require physical proximity — always the boundary of legal, authorized testing.',
    ],
  },

  'm-mobile-appsec': {
    intro:
      'Week 11 covered the OWASP Top 10 for web applications. Mobile apps run on a different platform with a different trust model — sandboxed per-app storage, a distinct permission system, and an install/distribution model instead of a URL — which produces its own, distinct vulnerability classes that a web-focused OWASP Top 10 simply does not cover.',
    builtOn: ['Week 9 — Web Application Security — OWASP Top 10'],
    sections: [
      {
        heading: 'Static analysis: what an APK gives away before you run it',
        paragraphs: [
          'An Android APK is just a signed zip file. Tools like apktool and jadx decompile it back into readable resources and near-source Java/Kotlin without ever executing the app. This alone regularly surfaces hardcoded API keys, debug flags left enabled in a release build, and insecure configuration (like allowing cleartext HTTP traffic) — all findable with zero dynamic testing at all.',
        ],
      },
      {
        heading: 'Dynamic analysis and instrumentation',
        paragraphs: [
          'Static analysis shows what is there; dynamic analysis (running the app, ideally in an emulator you control) shows what it actually does. Frida is an instrumentation framework that lets you hook into a running app\'s functions and change their behavior at runtime — the standard way to bypass a client-side root/jailbreak check or a certificate-pinning check, because you are not attacking the check\'s logic, you are simply telling the running process the check already passed.',
        ],
        code: 'frida -U -f com.example.app -l bypass-root-check.js --no-pause',
        codeLabel: 'Launching an app under Frida with an instrumentation script attached',
      },
      {
        heading: 'Certificate pinning and traffic interception',
        paragraphs: [
          'Setting up Burp Suite or mitmproxy as a proxy is how you actually see an app\'s network traffic — but certificate pinning, when implemented, makes the app refuse to trust your proxy\'s certificate even if it is installed as a trusted root on the device. This is exactly where Frida comes back in: a public pinning-bypass script for common pinning libraries removes the check at runtime, letting the same proxy setup finally see the traffic.',
        ],
      },
    ],
    takeaways: [
      'Static analysis of a decompiled APK finds real findings — hardcoded secrets, debug flags — before any dynamic testing begins.',
      'Frida-based instrumentation is how client-side checks (root detection, certificate pinning) get bypassed, by changing runtime behavior rather than the check\'s code.',
      'Certificate pinning defeats a naive proxy setup; combining it with instrumentation is the standard real-world workflow.',
      'Mobile\'s vulnerability classes (insecure local storage, platform API misuse) are genuinely distinct from the web OWASP Top 10, not a subset of it.',
    ],
  },

  'm-ics-scada': {
    intro:
      'Every core-path module so far implicitly assumed confidentiality and integrity matter most, with availability as a real but secondary concern. Industrial control systems (ICS/SCADA) invert that: an availability or safety failure can mean a halted production line, a contaminated water supply, or physical harm — which changes almost every practical decision, from patch timing to whether active scanning is even acceptable.',
    sections: [
      {
        heading: 'The Purdue Model',
        paragraphs: [
          'The Purdue Model layers an industrial environment from Level 0 (physical sensors and actuators) up through Level 5 (the corporate IT network), with the critical boundary sitting between the OT levels (0–3) and the IT levels (4–5). Most real ICS breaches do not start in OT at all — they start on the IT side and move laterally across a Purdue boundary that was assumed, incorrectly, to be well segmented.',
        ],
      },
      {
        heading: 'Protocols with no authentication by design',
        paragraphs: [
          'Modbus, DNP3, and S7comm were designed decades ago for reliability on isolated networks, not for security against an active adversary — most accept commands from any source with no authentication at all. Stuxnet\'s attack against Iranian centrifuges worked in part because it could send legitimate-looking Siemens S7 commands the PLC had no way to distinguish from an authorized engineering workstation.',
        ],
        callout: {
          label: 'Why "just add authentication" is not simple',
          text: 'Replacing decades-old protocols across a live industrial process means asset owners must weigh a security upgrade against an actual production outage risk — which is precisely why network segmentation at the Purdue boundary, not protocol replacement, is the primary real-world control.',
        },
      },
      {
        heading: 'Case study pattern: Stuxnet, Ukraine, Triton',
        paragraphs: [
          'Three of the most publicly documented ICS incidents show a consistent pattern worth studying directly from their public post-incident reports: Stuxnet (2010) targeted centrifuge PLCs via a USB-borne worm crossing an intended air gap; the Ukrainian grid attacks (2015/2016) combined phishing, stolen credentials, and direct SCADA manipulation to cause real blackouts; Triton/Trisis (2017) specifically targeted a safety instrumented system, the layer meant to prevent physical harm even after every other control fails — making it one of the most consequential ICS malware families ever documented.',
        ],
      },
    ],
    takeaways: [
      'The Purdue Model\'s IT/OT boundary is where most real ICS breaches actually cross, even though the payload ultimately lands in OT.',
      'Modbus, DNP3, and S7comm largely lack built-in authentication — segmentation, not protocol-level security, is the primary real-world control.',
      'Stuxnet, the Ukraine grid attacks, and Triton/Trisis each illustrate a different real consequence: process manipulation, cascading outage, and a direct attack on a safety system.',
      'OT security\'s first question is "will this action stop the process or cause harm," inverting the confidentiality-first instinct from IT security.',
    ],
  },

  'm-ai-security': {
    intro:
      'Every injection vulnerability covered earlier in this course (SQL injection, command injection) has a clean fix: parameterize the input, separate code from data. Prompt injection against a large language model resists that fix, because for an LLM, instructions and data arrive in the exact same channel — natural-language text — with no equivalent of a prepared statement to cleanly separate them.',
    sections: [
      {
        heading: 'Why prompt injection is architecturally different',
        paragraphs: [
          'A direct prompt injection is a user simply telling the model to ignore its previous instructions. An indirect prompt injection is more dangerous in real systems: malicious instructions hidden in a document, webpage, or email that the model later reads and processes on someone else\'s behalf — the attacker never interacts with the victim system directly at all. Because the model has no reliable way to distinguish "instructions from my developer" from "text I was asked to summarize," this class of vulnerability has no complete fix analogous to parameterized queries, only mitigations that reduce its blast radius.',
        ],
      },
      {
        heading: 'Excessive agency',
        paragraphs: [
          'The risk compounds sharply once a model can take actions — calling tools, querying a database, sending an email — rather than just returning text. "Excessive agency" describes a system granting an LLM more capability or autonomy than its actual task requires, so a successful prompt injection can now cause a real action, not just a bad response. The core defense is the same least-privilege principle from every other module in this course: a support chatbot that can only read ticket data should never also hold write access to the billing database, no matter how convenient that would be for one feature.',
        ],
      },
      {
        heading: 'Data leakage through outputs and RAG',
        paragraphs: [
          'A retrieval-augmented generation (RAG) system retrieves relevant private documents and feeds them into the model\'s context before it responds — which means the model\'s output can leak content from documents the current user was never authorized to see, if document-level access control is not enforced separately from the retrieval step itself. This is functionally the same authorization-boundary mistake as an IDOR vulnerability, just relocated into a retrieval pipeline instead of a URL parameter.',
        ],
      },
    ],
    takeaways: [
      'Prompt injection has no complete fix because instructions and data share the same channel — only mitigations that reduce blast radius exist.',
      'Indirect prompt injection (hidden in a document or webpage the model later reads) is often more dangerous than direct injection because the attacker never touches the victim system.',
      'Excessive agency turns a successful injection into a real action — least-privilege tool access is the core defense, unchanged from every other module in this course.',
      'RAG pipelines can leak unauthorized document content through model output unless access control is enforced at retrieval time, not just at the UI layer.',
    ],
  },

  'm-dlp-bcdr': {
    intro:
      'Week 16 taught incident response: contain, eradicate, recover from an incident already in progress. This module is about the layer above that — deciding in advance what data matters most, and what "recover" actually means in hours and data-loss terms before an incident ever happens, so the plan exists before it is needed under pressure.',
    builtOn: ['Week 16 — Incident Response: Plan, Contain, Eradicate, Recover'],
    sections: [
      {
        heading: 'Classification before controls',
        paragraphs: [
          'A data classification scheme (commonly public/internal/confidential/restricted) exists so that every subsequent control — encryption requirements, DLP rules, access restrictions — can be mapped to a tier instead of decided ad hoc for each new system. Skipping classification is why so many DLP programs fail: without a data owner deciding what "confidential" actually means for their data, a DLP tool has nothing consistent to enforce.',
        ],
      },
      {
        heading: 'DLP\'s real placement and real limits',
        paragraphs: [
          'DLP tooling sits at three layers — endpoint (blocking a USB copy or clipboard action), network (inspecting outbound traffic for classified patterns), and cloud/CASB (governing what leaves sanctioned SaaS apps) — and each layer is bypassable by a sufficiently motivated insider: a photo of a screen defeats all three. This is precisely why encryption at rest and in transit, and access control limiting who ever reaches the data at all, are treated as the actual backstop; DLP is a detective and deterrent layer, not the last line of defense.',
        ],
        callout: {
          label: 'The honest framing',
          text: 'If your only control against data exfiltration is DLP, you have a detection tool, not a prevention control. Pair it with access restriction and encryption, or the "control" is mostly theater against a determined insider.',
        },
      },
      {
        heading: 'RTO, RPO, and what they force you to decide',
        paragraphs: [
          'Recovery Time Objective (RTO) is how long the business can tolerate a system being down; Recovery Point Objective (RPO) is how much data loss, measured in time, is acceptable — a 4-hour RPO means backups at least every 4 hours, not once a day. These two numbers, chosen deliberately rather than left implicit, are what should actually drive backup frequency and infrastructure spend — an organization with a 1-hour RPO target running nightly backups has a plan that looks fine on paper and fails the moment it is tested.',
        ],
      },
      {
        heading: 'BCP, DR, and IR are related but distinct',
        paragraphs: [
          'Incident response (Week 16) answers "how do we contain and recover from this specific security incident." Disaster recovery answers "how do we restore IT systems and data after any major disruption," security-caused or not. Business continuity planning is the broadest: "how does the business keep operating at all," which may mean staff working from a different location with no IT systems restored yet. A ransomware incident that also encrypts backups is exactly the scenario where all three plans have to work together — and where testing them separately, in isolation, tends to miss the gap between them.',
        ],
      },
    ],
    takeaways: [
      'Data classification has to come before DLP/encryption/access-control decisions — those controls need a tier to map to.',
      'DLP is bypassable at every layer by a motivated insider; encryption and access control are the real backstop, DLP is detective/deterrent.',
      'RTO and RPO are decisions, not measurements — they should drive backup architecture, not be discovered as a gap during a real incident.',
      'Incident response, disaster recovery, and business continuity are distinct plans that must be tested together, since a ransomware-plus-backup-encryption scenario stresses the seams between all three.',
    ],
  },
}
