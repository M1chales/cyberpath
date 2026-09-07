// Real JWT "alg: none" authentication bypass — a genuine, well-documented vulnerability
// class (several real CVEs). A server that trusts the `alg` field a client sends, rather
// than enforcing its own expected algorithm, will accept a token with no signature at all
// as long as the header says `"alg":"none"`. This actually decodes and parses the base64
// segments — it is not checking for a fixed token string.
function decodeSegment(seg: string): string {
  const normalized = seg.trim().replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(padded)
}

export function checkJwtAdminBypass(authHeader: string): boolean {
  const match = /Bearer\s+(.+)/i.exec(authHeader.trim())
  const token = (match ? match[1] : authHeader).trim()
  const parts = token.split('.')
  if (parts.length < 2) return false
  try {
    const header = JSON.parse(decodeSegment(parts[0]))
    const payload = JSON.parse(decodeSegment(parts[1]))
    const algNone = typeof header.alg === 'string' && header.alg.toLowerCase() === 'none'
    const claimsAdmin = payload && (payload.role === 'admin' || payload.admin === true || payload.isAdmin === true)
    return algNone && !!claimsAdmin
  } catch {
    return false
  }
}
