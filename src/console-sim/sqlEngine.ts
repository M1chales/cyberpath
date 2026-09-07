export interface UserRow {
  username: string
  password: string
}

// Recognizes the two classic real SQL injection auth-bypass patterns rather than checking
// for a fixed answer string — many different real payloads should (and do) work here:
// tautology injection ("' OR '1'='1", "' OR 1=1--", "x' OR 'a'='a") and comment-based
// bypass ("admin'--", "admin' #"). This is a pattern recognizer for genuine SQLi technique,
// not a full SQL parser — documented as such, not oversold.
const TAUTOLOGY_RE = /'\s*(?:or|OR)\s*(?:'?\s*\w*\s*'?\s*=\s*'?\s*\w*\s*'?|1\s*=\s*1|true)/i
const COMMENT_RE = /(--|#)/

function truncateAtComment(input: string): string {
  const idx = input.search(COMMENT_RE)
  return idx >= 0 ? input.slice(0, idx) : input
}

export function attemptSqlLogin(usernameInput: string, passwordInput: string, rows: UserRow[]): { success: boolean; matchedUser?: string } {
  // Comment-based bypass: whatever comes after -- or # is dropped from the real query,
  // so if the part before it names a real user, the password check never actually runs.
  if (COMMENT_RE.test(usernameInput) || COMMENT_RE.test(passwordInput)) {
    const candidateUser = truncateAtComment(usernameInput).replace(/['"]/g, '').trim()
    const match = rows.find((r) => r.username.toLowerCase() === candidateUser.toLowerCase())
    if (match) return { success: true, matchedUser: match.username }
  }

  // Tautology-based bypass: an OR condition that is always true short-circuits the query
  // regardless of what the legitimate username/password comparison would have been.
  const combined = `${usernameInput} ${passwordInput}`
  if (TAUTOLOGY_RE.test(usernameInput) || TAUTOLOGY_RE.test(passwordInput) || TAUTOLOGY_RE.test(combined)) {
    return { success: true, matchedUser: rows[0]?.username }
  }

  // No injection — a completely normal, literal credential check (works if you actually
  // found the real password some other way, e.g. lateral movement via leaked creds).
  const legit = rows.find((r) => r.username === usernameInput && r.password === passwordInput)
  if (legit) return { success: true, matchedUser: legit.username }

  return { success: false }
}
