import { APP_STORAGE_KEY } from '../state/AppStateContext'
import { CONSOLE_STORAGE_KEY } from '../console-sim/persistence'

// No account exists anywhere in this app — everything lives in this browser's localStorage,
// which means clearing site data or switching browsers/devices loses it with nothing to recover
// it from. This is the account-free substitute: a plain JSON file the visitor keeps themselves.
const BACKUP_FORMAT = 'cyberpath-backup'
const BACKUP_VERSION = 1

interface BackupFile {
  format: typeof BACKUP_FORMAT
  version: number
  exportedAt: string
  data: Record<string, string>
}

export function exportBackup(): string {
  const data: Record<string, string> = {}
  for (const key of [APP_STORAGE_KEY, CONSOLE_STORAGE_KEY]) {
    const raw = localStorage.getItem(key)
    if (raw !== null) data[key] = raw
  }
  const file: BackupFile = { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data }
  return JSON.stringify(file, null, 2)
}

export function downloadBackup() {
  const json = exportBackup()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `cyberpath-progress-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBackup(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' }
  }
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    (parsed as Partial<BackupFile>).format !== BACKUP_FORMAT ||
    typeof (parsed as Partial<BackupFile>).data !== 'object'
  ) {
    return { ok: false, error: 'That file is not a cyberpath progress backup.' }
  }
  const { data } = parsed as BackupFile
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') localStorage.setItem(key, value)
  }
  return { ok: true }
}
