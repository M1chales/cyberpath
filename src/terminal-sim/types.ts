export interface VFile {
  type: 'file'
  content: string
  mode: number // e.g. 0o640
  owner: string
  group: string
}

export interface VDir {
  type: 'dir'
  children: Record<string, VNode>
  mode: number
  owner: string
  group: string
}

export type VNode = VFile | VDir

export interface VProcess {
  pid: number
  user: string
  cmd: string
}

export interface VPort {
  port: number
  service: string
  version?: string
}

export interface VHost {
  ip: string
  ports: VPort[]
}

export interface ShellState {
  root: VDir
  cwd: string
  user: string
  processes: VProcess[]
  services: Record<string, 'active' | 'inactive'>
  hosts: VHost[]
  flags: Record<string, boolean>
  submissions: Record<string, string>
  // Real sudoers-style rules for the current user, e.g. "cat /root/root.txt" or a
  // GTFOBins-style prefix like "find". `sudo -l` lists them, `sudo <cmd>` checks against them.
  sudoRules?: string[]
}

export interface Objective {
  id: string
  label: string
  check: (state: ShellState) => boolean
}

export interface Scenario {
  id: string
  title: string
  emoji: string
  prompt: string
  briefing: string[]
  buildInitialState: () => ShellState
  objectives: Objective[]
  commands: string[] // which command names are available/documented for this scenario
  hints: string[]
}
