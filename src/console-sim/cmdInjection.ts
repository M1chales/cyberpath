// Recognizes real shell metacharacter injection syntax (;, &&, ||, |, backticks, $(...))
// rather than checking for a fixed keyword — genuinely splits the input the way an
// unsanitized `exec("ping " + userInput)` call would concatenate and execute it.
const META_SPLIT_RE = /;|&&|\|\||\||`|\$\(/

const FAKE_OUTPUTS: { match: RegExp; output: string }[] = [
  { match: /cat\s+\/etc\/shadow/i, output: 'root:$6$fakehash$Kj9xQ2mZ...:19835:0:99999:7:::\nsvc-backup:$6$fakehash$Wp1vN8rT...:19835:0:99999:7:::' },
  { match: /cat\s+\/etc\/passwd/i, output: 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33::/var/www:/usr/sbin/nologin\nsvc-backup:x:1001:1001::/home/svc-backup:/bin/bash' },
  { match: /whoami/i, output: 'www-data' },
  { match: /\bid\b/i, output: 'uid=33(www-data) gid=33(www-data) groups=33(www-data)' },
  { match: /\bls\b/i, output: 'app.py  config.yml  requirements.txt  .env' },
  { match: /cat\s+\.env/i, output: 'DB_PASSWORD=S3cur3-Backup-2024\nAPI_KEY=sk_live_9f8a2b1c' },
]

export interface PingResult {
  injected: boolean
  output: string
}

export function evaluatePingEndpoint(target: string): PingResult {
  if (!META_SPLIT_RE.test(target)) {
    return { injected: false, output: `PING ${target}: 3 packets transmitted, 3 received, 0% packet loss` }
  }
  const injectedPart = target.split(META_SPLIT_RE).slice(1).join(' ').replace(/\)/g, '').trim()
  const known = FAKE_OUTPUTS.find((f) => f.match.test(injectedPart))
  if (known) return { injected: true, output: known.output }
  return { injected: true, output: `sh: 1: ${injectedPart || 'command'}: executed, no recognizable output` }
}
