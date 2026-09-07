import type { VDir } from '../terminal-sim/types'

export type VulnClass =
  | 'ftp-anon'
  | 'ssh-weak-creds'
  | 'http-default-creds'
  | 'sql-injection'
  | 'cmd-injection'
  | 'dir-traversal'
  | 'file-upload-rce'
  | 'jwt-none-alg'
  | 'cleartext-sniffing'

export interface HostDef {
  id: string
  hostname: string
  ip: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  vulnClass: VulnClass
  port: number
  service: string
  banner: string
  sshUser: string
  sshPassword: string
  dbUsername: string
  dbPassword: string
  httpUser: string
  httpPass: string
  connections: string[]
  moneyReward: number
  repReward: number
  fs: VDir
  sudoRules: string[]
  discovered: boolean
  userCompromised: boolean
  rootObtained: boolean
  credsFound: boolean
  isIncident: boolean
  incidentExpiresAt: number | null
  incidentResolved: 'pending' | 'resolved' | 'missed' | null
}

export interface PlayerProfile {
  money: number
  rep: number
  xp: number
  vulnClassesUsed: string[]
}

export interface ConsoleWorld {
  version: 5
  seed: number
  homeId: string
  currentHostId: string
  currentUser: string
  cwd: string
  hosts: HostDef[]
  player: PlayerProfile
  scripts: Record<string, string>
  incidentsResolved: number
  incidentsMissed: number
}
